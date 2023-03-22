import { redirect } from "@sveltejs/kit"

export async function load({ parent, url }) {
  const { session } = await parent()

  // check if user is logged in
  if (!session.user) {
    throw redirect(302, `/login?referrer=${encodeURIComponent(url.href)}`)
  }

  throw redirect(302, `/transactions`)
}
