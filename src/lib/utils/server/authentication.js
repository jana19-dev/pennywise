import jwt from "jsonwebtoken"

import { JWT_SECRET } from "$env/static/private"

export const generateToken = async (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: `12h` })
}

export const getSession = async (req) => {
  try {
    const token = req.cookies.get(`PENNYWISE_SESSION_ID`, {
      path: `/`,
      httpOnly: true,
      sameSite: `lax`,
      secure: true
    })

    return token ? jwt.verify(token, JWT_SECRET) : null
  } catch (error) {
    return null
  }
}
