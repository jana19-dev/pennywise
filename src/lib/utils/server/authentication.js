import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import { auth } from "$lib/utils/firebase"

export const getSession = async (req) => {
  try {
    const accessToken = req.cookies.get(`accessToken`, {
      path: `/`,
      httpOnly: true,
      sameSite: `lax`,
      secure: true
    })

    const credential = GoogleAuthProvider.credential(accessToken)

    const { user } = await signInWithCredential(auth, credential)

    return {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL
    }
  } catch (error) {
    return null
  }
}
