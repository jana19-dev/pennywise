import { redirect, error } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"
import { generateToken } from "$lib/utils/server/authentication"
import prisma from "$lib/utils/server/prisma"

export async function GET({ url, cookies }) {
  const code = url.searchParams.get(`code`)
  const state = url.searchParams.get(`state`)
  const savedState = cookies.get(`oauth_state`)
  const referrer = cookies.get(`oauth_referrer`) || `/`

  // Clean up OAuth cookies
  cookies.delete(`oauth_state`, { path: `/` })
  cookies.delete(`oauth_referrer`, { path: `/` })

  if (!code || !state || state !== savedState) {
    throw error(400, `Invalid OAuth callback`)
  }

  const redirectUri = `${url.origin}/login/callback`

  // Exchange authorization code for tokens
  const tokenResponse = await fetch(`https://oauth2.googleapis.com/token`, {
    method: `POST`,
    headers: { "Content-Type": `application/x-www-form-urlencoded` },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: `authorization_code`
    })
  })

  if (!tokenResponse.ok) {
    throw error(500, `Failed to exchange authorization code`)
  }

  const tokens = await tokenResponse.json()

  // Fetch user info from Google
  const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })

  if (!userInfoResponse.ok) {
    throw error(500, `Failed to fetch user info`)
  }

  const googleUser = await userInfoResponse.json()

  // Check if user exists in database
  const userExists = await prisma.user.findUnique({
    where: { email: googleUser.email },
    select: { id: true }
  })

  if (!userExists) {
    throw error(401, `You are not authorized to access this application.`)
  }

  // Generate JWT session token
  const token = await generateToken({
    name: googleUser.name,
    email: googleUser.email,
    image: googleUser.picture
  })

  cookies.set(`PENNYWISE_SESSION_ID`, token, {
    path: `/`,
    httpOnly: true,
    sameSite: `lax`,
    secure: !dev
  })

  throw redirect(302, referrer)
}
