import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import getConfig from '../config/getConfig.js'

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const config = await getConfig()
  const { baseDir } = config
  const { consortiumId, runId } = req.params
  const uploadPath = path.join(baseDir, consortiumId, runId)

  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      fs.mkdirSync(uploadPath, { recursive: true })
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  })

  
  const upload = multer({ storage }).single('file')
  upload(req, res, (err) => {
    if (err) {
      console.error('Error during file upload:', err)
      return res.status(500).send(`Error during file upload: ${err.message}`)
    }
    console.log(`file uploaded to ${uploadPath}`)
    next()
  })
}