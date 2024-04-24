import axios from 'axios'
import fs from 'fs'
import path from 'path'

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
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'x-access-token': accessToken,
      },
      responseType: 'stream',
    })

    // Log successful receipt of the response
    console.log('Response received, streaming to file.')

    await fs.promises.mkdir(path_output_dir, { recursive: true })
    const path_output_file = path.join(path_output_dir, outputFilename)
    const writer = fs.createWriteStream(path_output_file)

    response.data.pipe(writer)

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        console.log('File write completed successfully.')
        resolve()
      })
      writer.on('error', (error) => {
        console.error('File write failed:', error)
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
      console.error(
        'Failed to download file:',
        JSON.stringify(errorDetails, null, 2),
      )
    } else {
      console.error('Unexpected error:', error)
      customError = error
    }
    throw customError // Rethrow the error after logging it
  }
}