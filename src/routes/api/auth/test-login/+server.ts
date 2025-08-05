import type { RequestHandler } from "@sveltejs/kit"
import { json } from "@sveltejs/kit"
import { createSessionToken, setSessionCookie } from "$lib/server/auth.js"
import { UserService } from "$lib/server/services/index.js"

const userService = new UserService()

export const POST: RequestHandler = async (event) => {
	try {
		// Simulate Google user data for testing
		const testGoogleUser = {
			id: "test-google-id-12345",
			name: "Test User",
			email: "test@example.com",
		}

		// Find or create user in our database
		const user = await userService.findOrCreateByGoogleId(testGoogleUser.id, {
			name: testGoogleUser.name,
			email: testGoogleUser.email,
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

		return json({
			success: true,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		})
	} catch (error) {
		console.error("Test auth error:", error)
		return json({ success: false, error: "Authentication failed" }, { status: 500 })
	}
}
