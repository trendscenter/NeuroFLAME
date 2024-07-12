import path from 'path'
import zlib from 'zlib'
import tar from 'tar-stream'
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

    // Create extraction stream
    const extract = tar.extract()

    extract.on('entry', async (header: any, stream: any, next: any) => {
      const filePath = path.join(extractPath, header.name)
      const writeStream = fs.createWriteStream(filePath)
      stream.pipe(writeStream)

      stream.on('end', () => {
        next()
      })

      stream.resume()
    })

    extract.on('finish', () => {
      console.log(`File uploaded and extracted successfully to ${extractPath}`)
      next()
    })

    // Create a read stream from the zip file and pipe it through zlib and tar-stream
    fs.createReadStream(zipPath).pipe(zlib.createGunzip()).pipe(extract)
  } catch (error) {
    next(error)
  }
}
