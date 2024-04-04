import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'
export { compare } from 'bcrypt'
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
} from './environmentVariables.js'

const { sign, verify } = jwt

export const generateTokens = (
  payload = {},
  options: { shouldExpire?: boolean } = {},
) => {
  const { shouldExpire = true } = options

  const accessTokenOptions = shouldExpire
    ? { expiresIn: ACCESS_TOKEN_DURATION }
    : {}
  const refreshTokenOptions = shouldExpire
    ? { expiresIn: REFRESH_TOKEN_DURATION }
    : {}

  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, accessTokenOptions)
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, refreshTokenOptions)

  return { accessToken, refreshToken }
}

// the following two functions wrap verify() in a try/catch to muffle expired jwt errors
export const validateAccessToken = (token: string) => {
  try {
    return verify(token, ACCESS_TOKEN_SECRET)
  } catch (error) {
    console.error(`Access token error: ${error.message}`)
  }
}

export const validateRefreshToken = (token) => {
  try {
    return verify(token, REFRESH_TOKEN_SECRET)
  } catch (error) {
    if (error.message !== 'jwt expired') {
      // console.error(`Refresh token error: ${error.message}`);
    }
  }
}

export const hashPassword = async (password) => {
  const saltRounds = 10
  return hash(password, saltRounds)
}
