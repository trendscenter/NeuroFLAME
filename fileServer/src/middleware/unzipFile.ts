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

    // copy the file from the zip path to a temporary path
    const tmpPath = path.join(extractPath, 'tmp.zip')

    await fs.copy(zipPath, tmpPath)

    // small delay to ensure the file is written to disk
    await new Promise((resolve) => setTimeout(resolve, 5000))

    console.log({ tmpPath, zipPath, extractPath })

    // Extract the zip file
    await fs
      .createReadStream(tmpPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise()

    // Delete the temporary zip file
    // await fs.unlink(tmpPath)

    console.log(`File uploaded and extracted successfully to ${extractPath}`)
    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    next(error)
  }
}

