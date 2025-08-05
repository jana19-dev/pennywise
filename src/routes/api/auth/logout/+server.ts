import type { RequestHandler } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { clearSessionCookie } from "$lib/server/auth.js"

export const POST: RequestHandler = async (event) => {
	clearSessionCookie(event)
	throw redirect(302, "/login")
}

export const GET: RequestHandler = async (event) => {
	clearSessionCookie(event)
	throw redirect(302, "/login")
}
