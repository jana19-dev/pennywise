import { redirect } from "@sveltejs/kit"

export async function load({ parent, url }) {
  const { session } = await parent()

  // special case for login page; if user is already logged in, redirect to home
  if (session.user) {
    const referrer = url.searchParams.get(`referrer`)
    throw redirect(302, referrer || `/`)
  }
  return {
    session
  }
}
