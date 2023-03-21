import { getSession } from "$lib/utils/server/authentication"

export async function load(req) {
  const session = {}

  try {
    session.user = await getSession(req)
  } catch (error) {
    // ignore any errors
  }

  return {
    session
  }
}
