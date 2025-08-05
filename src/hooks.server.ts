import type { Handle } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { getUserFromRequest } from "$lib/server/auth.js"

export const handle: Handle = async ({ event, resolve }) => {
	// Get user from session cookie
	const user = await getUserFromRequest(event)

	// Add user to locals for use in routes
	event.locals.user = user

	// Check if route requires authentication
	const { pathname } = event.url

	// Allow these routes without authentication
	const publicRoutes = ["/login", "/api/auth/login", "/api/auth/callback", "/api/auth/test-login"]

	// Check if current path is public
	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

	// If not authenticated and not on a public route, redirect to login
	if (!user && !isPublicRoute) {
		throw redirect(302, "/login")
	}

	// If authenticated and on login page, redirect to home
	if (user && pathname === "/login") {
		throw redirect(302, "/")
	}

	return resolve(event)
}
