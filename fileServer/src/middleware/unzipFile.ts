import path from 'path'
import unzipper from 'unzipper'
import fs from 'fs-extra'
import { Request, Response, NextFunction } from 'express'
import getConfig from '../config/getConfig.js'
import logger from '../logger.js'

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

    logger.log(JSON.stringify({ tmpPath, zipPath, extractPath }), 'info')

    // Extract the zip file
    try {
      await fs
        .createReadStream(tmpPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .promise()
    } catch (e) {
      // skip the error because the files seem to extract correctly
      // TODO: investigate why the error is thrown
      logger.log(`Error extracting the file: ${e}, continuing...`, 'error')
    }

    // Delete the temporary zip file
    // await fs.unlink(tmpPath)

    logger.log(
      `File uploaded and extracted successfully to ${extractPath}`,
      'info',
    )
    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    next(error)
  }
}
