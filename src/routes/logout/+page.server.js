import { redirect } from "@sveltejs/kit"

export async function load({ cookies }) {
  cookies.set(`PENNYWISE_SESSION_ID`, ``, {
    expires: new Date(0),
    path: `/`,
    sameSite: `none`,
    secure: true
  })
  throw redirect(302, `/login`)
}
