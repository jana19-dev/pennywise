import { GraphQLError } from "graphql"
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import { auth } from "$lib/utils/firebase"

export default async function handler(parent, args, context) {
  try {
    const { accessToken } = args

    const credential = GoogleAuthProvider.credential(accessToken)

    const { user } = await signInWithCredential(auth, credential)

    context.reqEvent.cookies.set(`accessToken`, accessToken, {
      path: `/`,
      httpOnly: true,
      sameSite: `lax`,
      secure: true
    })

    return user
  } catch (error) {
    throw new GraphQLError(error.message, { extensions: { code: 500 } })
  }
}
