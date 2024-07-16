import { Request, Response, NextFunction } from 'express'
import unzipper from 'unzipper'
import path from 'path'
import fs from 'fs'

interface MulterRequest extends Request {
  file: Express.Multer.File
  unzippedPath?: string
}

const testUnzip = (req: MulterRequest, res: Response, next: NextFunction) => {
  const { consortiumId, runId } = req.params
  const filePath = req.file.path
  const outputDir = path.join(__dirname, 'unzip_output', consortiumId, runId)

  // Create output directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true })

  fs.createReadStream(filePath)
    .pipe(unzipper.Extract({ path: outputDir }))
    .on('close', () => {
      req.unzippedPath = outputDir
      next()
    })
    .on('error', (err: Error) => {
      next(err)
    })
}

export default testUnzip
