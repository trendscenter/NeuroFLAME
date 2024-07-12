import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import unzipper from 'unzipper'
import getConfig from './config/getConfig.js'

interface TokenPayload {
  consortiumId?: string
  runId?: string
  userId: string
  roles?: string[]
}

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload
    }
  }
}

const init = async () => {
  const app = express()
  const config = await getConfig()
  const {
    port: PORT,
    baseDir: BASE_DIR,
    authenticationUrl: AUTHENTICATION_URL,
  } = config

  app.use(express.json())

  // Middleware for JWT decoding and validation
  const decodeAndValidateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.headers['x-access-token'] as string | undefined
    if (!token) {
      return res.status(401).send('Access token is required')
    }

    try {
      const response = await axios.post(AUTHENTICATION_URL, { token })

      if (response.status === 200 && response.data?.decodedAccessToken) {
        req.tokenPayload = response.data.decodedAccessToken
        next()
      } else {
        res.status(401).send('Invalid token')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      res.status(500).send('Authentication service error')
    }
  }

  // Middleware to check if user is a central user
  const isCentralUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.tokenPayload?.roles?.includes('central')) {
      next()
    } else {
      res.status(403).send('Unauthorized: Only central user can upload files.')
    }
  }

  // Utility function to check if file exists
  const fileExists = async (filePath: string): Promise<boolean> => {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK)
      return true
    } catch {
      return false
    }
  }

  // Multer storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { consortiumId, runId } = req.params
      const uploadPath = path.join(BASE_DIR, consortiumId, runId)
      fs.mkdirSync(uploadPath, { recursive: true })
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })

  const upload = multer({ storage })

  // Route to download a file
  app.post(
    '/download/:consortiumId/:runId/:userId',
    decodeAndValidateJWT,
    async (req: Request, res: Response) => {
      const { consortiumId, runId, userId } = req.params
      const {
        consortiumId: tokenConsortiumId,
        runId: tokenRunId,
        userId: tokenUserId,
      } = req.tokenPayload!

      if (!tokenConsortiumId || !tokenRunId || !tokenUserId) {
        return res.status(400).send('Missing required token payload data')
      }
      if (
        tokenConsortiumId !== consortiumId ||
        tokenRunId !== runId ||
        tokenUserId !== userId
      ) {
        return res
          .status(400)
          .send('Token payload data does not match requested resource')
      }

      const filePath = path.join(
        BASE_DIR,
        tokenConsortiumId,
        tokenRunId,
        `${tokenUserId}.zip`,
      )
      if (await fileExists(filePath)) {
        res.sendFile(filePath)
      } else {
        res.status(404).send('File not found')
      }
    },
  )

  // Route to upload and extract a file
  app.post(
    '/upload/:consortiumId/:runId',
    decodeAndValidateJWT,
    isCentralUser,
    upload.single('file'),
    async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).send('No file uploaded.')
      }

      const { path: zipPath, originalname } = req.file
      const extractPath = path.join(
        BASE_DIR,
        req.params.consortiumId,
        req.params.runId,
      )

      try {
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', resolve)
            .on('error', reject)
        })

        // fs.unlinkSync(zipPath)
        res.send(
          `File ${originalname} uploaded and extracted successfully to ${extractPath}`,
        )
      } catch (error: any) {
        console.error('Error unzipping file:', error)
        res.status(500).send(`Error unzipping the file: ${error.message}`)
      }
    },
  )

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

init().catch((error) => {
  console.error('Failed to initialize server:', error)
  process.exit(1)
})
