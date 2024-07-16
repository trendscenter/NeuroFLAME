import { Request, Response, NextFunction } from 'express'
import unzipper from 'unzipper'
import path from 'path'
import fs from 'fs'
import getConfig from '../config/getConfig'

interface MulterRequest extends Request {
  file: Express.Multer.File
  unzippedPath?: string
}

const config = await getConfig()

const testUnzip = (req: MulterRequest, res: Response, next: NextFunction) => {
  const { consortiumId, runId } = req.params
  const filePath = req.file.path

  const { baseDir } = config
  const extractPath = path.join(baseDir, consortiumId, runId)

  // Create output directory if it doesn't exist
  fs.mkdirSync(extractPath, { recursive: true })

  fs.createReadStream(filePath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on('close', () => {
      req.unzippedPath = extractPath
      next()
    })
    .on('error', (err: Error) => {
      next(err)
    })
}

export default testUnzip
