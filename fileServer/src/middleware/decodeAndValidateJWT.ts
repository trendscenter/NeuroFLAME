import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import getConfig from '../config/getConfig.js'
import logger from '../logger.js'

const decodeAndValidateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const config = await getConfig()
  const { authenticationUrl: AUTHENTICATION_URL } = config
  const token = req.headers['x-access-token'] as string | undefined
  if (!token) return res.status(401).send('Access token is required')

  try {
    const response = await axios.post(AUTHENTICATION_URL, { token })
    if (response.status === 200 && response.data?.decodedAccessToken) {
      res.locals.tokenPayload = response.data.decodedAccessToken
      next()
    } else {
      res.status(401).send('Invalid token')
    }
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(500).send('Authentication service error')
  }
}

export default decodeAndValidateJWT
