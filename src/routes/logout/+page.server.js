import { redirect } from "@sveltejs/kit"
import { dev } from "$app/environment"

export async function load({ cookies }) {
  cookies.set(`PENNYWISE_SESSION_ID`, ``, {
    expires: new Date(0),
    path: `/`,
    sameSite: `none`,
    secure: !dev
  })
  throw redirect(302, `/login`)
}
