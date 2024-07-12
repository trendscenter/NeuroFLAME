import path from 'path'
import unzipper from 'unzipper'
import fs from 'fs-extra'
import { Request, Response, NextFunction } from 'express'
import getConfig from '../config/getConfig.js'

export const unzipFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded')
    }

    const zipPath = req.file.path
    const { consortiumId, runId } = req.params
    const config = await getConfig()
    const { baseDir } = config
    const extractPath = path.join(baseDir, consortiumId, runId)

    // Ensure the extract path exists
    await fs.ensureDir(extractPath)

    // small delay to ensure the file is written to disk
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Extract the zip file
    await fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise()

    console.log(`File uploaded and extracted successfully to ${extractPath}`)
    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    next(error)
  }
}
