import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import getConfig from './config/getConfig'

// Define the structure of the user payload expected in the request
interface UserPayload {
  consortiumId: string
  runId: string
  userId: string
}

// Extend Express Request object to include custom user property
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

// Initialize Express application
const app = express()

const config = await getConfig()
const PORT = config.port // Port number for the server
const BASE_DIR = config.baseDir // Base directory for storing files
const AUTHENTICATION_URL = config.authenticationUrl // URL for the authentication service

// Middleware to parse JSON bodies
app.use(express.json())

/**
 * Middleware to validate JWT by calling an external authentication service.
 * If the token is valid, it attaches the decoded user information to the request object.
 */
const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers['x-access-token']
  if (!token) {
    res.status(401).send('Access token is required')
    return
  }

  try {
    const response = await axios.post(
      AUTHENTICATION_URL,
      {},
      {
        headers: { 'x-access-token': token },
      },
    )

    if (response.data && response.data.isValid) {
      req.user = response.data.decodedToken as UserPayload
      next()
    } else {
      res.status(401).send('Invalid Token')
    }
  } catch (error) {
    res.status(500).send('Authentication service error')
  }
}

/**
 * Endpoint to handle file download requests.
 * Validates user data and sends the requested file if it exists.
 */
app.post(
  '/download',
  validateJWT,
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!
    if (!user || !user.consortiumId || !user.runId || !user.userId) {
      res.status(400).send('Missing required user payload data')
      return
    }

    const filePath = path.join(
      BASE_DIR,
      user.consortiumId,
      user.runId,
      `${user.userId}.zip`,
    )
    if (await fileExists(filePath)) {
      res.sendFile(filePath)
    } else {
      res.status(404).send('File not found')
    }
  },
)

/**
 * Helper function to check if a file exists at the given path.
 * Returns true if the file exists, false otherwise.
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

// Start the server on the configured port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
