import type { RequestHandler } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import { createSessionToken, setSessionCookie } from "$lib/server/auth.js"
import { UserService } from "$lib/server/services/index.js"

const userService = new UserService()

export const GET: RequestHandler = async (event) => {
	const { url } = event
	const code = url.searchParams.get("code")
	const error = url.searchParams.get("error")

	if (error || !code) {
		console.error("OAuth error:", error)
		throw redirect(302, "/login?error=oauth_failed")
	}

	try {
		// Exchange code for tokens
		const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: env.GOOGLE_CLIENT_ID || "",
				client_secret: env.GOOGLE_CLIENT_SECRET || "",
				code,
				grant_type: "authorization_code",
				redirect_uri: `${url.origin}/api/auth/callback`,
			}),
		})

		if (!tokenResponse.ok) {
			throw new Error("Failed to exchange code for tokens")
		}

		const tokens = await tokenResponse.json()

		// Get user info from Google
		const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		})

		if (!userResponse.ok) {
			throw new Error("Failed to get user info")
		}

		const googleUser = await userResponse.json()

		// Find or create user in our database
		const user = await userService.findOrCreateByGoogleId(googleUser.id, {
			name: googleUser.name,
			email: googleUser.email,
		})

		// Create session token
		const sessionToken = await createSessionToken({
			id: user.id,
			googleId: user.googleId,
			name: user.name,
			email: user.email,
		})

		// Set session cookie
		setSessionCookie(event, sessionToken)

		// Redirect to dashboard
		throw redirect(302, "/")
	} catch (error) {
		console.error("OAuth callback error:", error)
		throw redirect(302, "/login?error=auth_failed")
	}
}
