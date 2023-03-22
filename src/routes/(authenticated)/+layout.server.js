import { redirect } from "@sveltejs/kit"

export async function load(req) {
  const { session } = await req.parent()

  // check if user is logged in
  if (!session.user) {
    throw redirect(302, `/login?referrer=${encodeURIComponent(req.url.href)}`)
  }

  return {
    session
  }
}
