import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import calculateChecksum from '../utils/calculateChecksum.js'
import getConfig from '../config/getConfig.js'

export const unzipFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return res.status(400).send('No file uploaded.')

  const { path: zipPath, originalname } = req.file

  try {
    const config = await getConfig()
    const { baseDir } = config
    const extractPath = path.join(
      baseDir,
      req.params.consortiumId,
      req.params.runId,
    )

    // await new Promise<void>((resolve, reject) => {
    //   fs.createReadStream(zipPath)
    //     .pipe(unzipper.Parse())
    //     .on('entry', (entry) => entry.autodrain())
    //     .on('error', (error) => reject(error))
    //     .on('close', () => resolve())
    // })

    const checksumAfterValidation = await calculateChecksum(zipPath)
    console.log(`Checksum after validation: ${checksumAfterValidation}`)

    // add a pause here

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => resolve())
        .on('error', (error) => reject(error))
    })

    const checksumAfterExtraction = await calculateChecksum(zipPath)
    console.log(`Checksum after extraction: ${checksumAfterExtraction}`)

    req.extractPath = extractPath
    next()
  } catch (error) {
    console.error('Error during file unzipping:', error)
    res
      .status(500)
      .send(`Error during file unzipping: ${(error as Error).message}`)
  }
}

// Extend the Request interface to include extract path
declare global {
  namespace Express {
    interface Request {
      extractPath?: string
    }
  }
}
