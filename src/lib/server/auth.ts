import type { RequestEvent } from "@sveltejs/kit"
import { jwtVerify, SignJWT } from "jose"
import { env } from "$env/dynamic/private"

const secret = new TextEncoder().encode(env.JWT_SECRET || "default-secret-for-development-only")

export interface UserSession {
	id: string
	googleId: string
	name: string
	email: string
}

/**
 * Create a JWT token for a user session
 */
export async function createSessionToken(user: UserSession): Promise<string> {
	return await new SignJWT({
		sub: user.id,
		googleId: user.googleId,
		name: user.name,
		email: user.email,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d") // Token expires in 7 days
		.sign(secret)
}

/**
 * Verify and decode a JWT token
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
	try {
		const { payload } = await jwtVerify(token, secret)

		return {
			id: payload.sub as string,
			googleId: payload.googleId as string,
			name: payload.name as string,
			email: payload.email as string,
		}
	} catch (error) {
		console.error("JWT verification failed:", error)
		return null
	}
}

/**
 * Get user session from request cookies
 */
export async function getUserFromRequest(event: RequestEvent): Promise<UserSession | null> {
	const token = event.cookies.get("session")
	if (!token) return null

	return await verifySessionToken(token)
}

/**
 * Set session cookie
 */
export function setSessionCookie(event: RequestEvent, token: string) {
	event.cookies.set("session", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	})
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(event: RequestEvent) {
	event.cookies.delete("session", {
		path: "/",
	})
}
