import type { RequestHandler } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"

export const GET: RequestHandler = async ({ url }) => {
	const params = new URLSearchParams({
		client_id: env.GOOGLE_CLIENT_ID || "",
		redirect_uri: `${url.origin}/api/auth/callback`,
		response_type: "code",
		scope: "openid email profile",
		access_type: "offline",
		prompt: "consent",
	})

	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

	throw redirect(302, authUrl)
}
