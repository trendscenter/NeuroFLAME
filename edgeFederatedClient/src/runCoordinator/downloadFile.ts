import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { logger } from '../logger.js'

export default async function ({
  url,
  accessToken,
  path_output_dir,
  outputFilename,
}: {
  url: string
  accessToken: string
  path_output_dir: string
  outputFilename: string
}) {
  try {
    logger.info(`Attempting to download from URL: ${url}`)

    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'x-access-token': accessToken,
      },
      responseType: 'stream',
    })

    // Log successful receipt of the response
    logger.info('Response received, streaming to file.')

    await fs.promises.mkdir(path_output_dir, { recursive: true })
    const path_output_file = path.join(path_output_dir, outputFilename)
    const writer = fs.createWriteStream(path_output_file)
    logger.info(`Writing to file: ${path_output_file}`)

    response.data.pipe(writer)

    // Check download completion
    return new Promise<void>((resolve, reject) => {
      writer.on('finish', async () => {
        logger.info('File write completed successfully.')

        // Verify file size matches expected content-length
        const fileSize = (await fs.promises.stat(path_output_file)).size
        const contentLength = response.headers['content-length']

        if (contentLength && fileSize !== parseInt(contentLength, 10)) {
          reject(
            new Error(
              `File size mismatch: expected ${contentLength}, but got ${fileSize}`,
            ),
          )
        } else {
          resolve()
        }
      })

      writer.on('error', (error) => {
        logger.error('File write failed:', error.toString())
        reject(error)
      })
    })
  } catch (error) {
    let customError
    if (axios.isAxiosError(error)) {
      customError = new Error(`Failed to download file: ${error.message}`)

      const errorDetails = {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
      }
      logger.error(
        'Failed to download file:',
        JSON.stringify(errorDetails, null, 2),
      )
    } else {
      logger.error('Unexpected error:', JSON.stringify(error, null, 2))
      customError = error
    }
    throw customError // Rethrow the error after logging it
  }
}
