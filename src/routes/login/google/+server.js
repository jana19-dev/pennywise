import { redirect } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"

export function GET({ url, cookies }) {
  const referrer = url.searchParams.get(`referrer`) || `/`

  const state = crypto.randomUUID()
  cookies.set(`oauth_state`, state, {
    path: `/`,
    httpOnly: true,
    sameSite: `lax`,
    secure: !dev,
    maxAge: 60 * 10
  })

  cookies.set(`oauth_referrer`, referrer, {
    path: `/`,
    httpOnly: true,
    sameSite: `lax`,
    secure: !dev,
    maxAge: 60 * 10
  })

  const redirectUri = `${url.origin}/login/callback`

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: `code`,
    scope: `openid email profile`,
    state,
    access_type: `online`,
    prompt: `select_account`
  })

  throw redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
