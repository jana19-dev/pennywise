import { initializeApp } from "firebase/app"

import { getAuth } from "firebase/auth"

import { GoogleAuthProvider } from "firebase/auth"

const provider = new GoogleAuthProvider()

const firebaseConfig = {
  apiKey: `AIzaSyBJ8jBBtKcXVxl-DJs4Pn-P14mGp1cHX-I`,
  authDomain: `budget-codepiercer.firebaseapp.com`,
  projectId: `budget-codepiercer`,
  storageBucket: `budget-codepiercer.appspot.com`,
  messagingSenderId: `592842478896`,
  appId: `1:592842478896:web:01872204120cf8e3eca4f5`
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export { auth, provider }
