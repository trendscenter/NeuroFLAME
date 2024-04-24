import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'
export { compare } from 'bcrypt'
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
} from '../config/environmentVariables.js'

const { sign, verify } = jwt

export const generateTokens = (
  payload = {},
  options: { shouldExpire?: boolean } = {},
) => {
  const { shouldExpire = true } = options

  const accessTokenOptions = shouldExpire
    ? { expiresIn: ACCESS_TOKEN_DURATION }
    : {}

  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, accessTokenOptions)

  return { accessToken }
}

export const validateAccessToken = (token: string) => {
  try {
    return verify(token, ACCESS_TOKEN_SECRET)
  } catch (error) {
    console.error(`Access token error: ${error.message}`)
  }
}

export const hashPassword = async (password) => {
  const saltRounds = 10
  return hash(password, saltRounds)
}