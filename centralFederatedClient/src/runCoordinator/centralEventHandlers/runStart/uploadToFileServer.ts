import axios from 'axios'
import FormData from 'form-data'
import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import archiver from 'archiver'
import getConfig from '../../../config/getConfig.js'

interface UploadParameters {
  consortiumId: string
  runId: string
  path_baseDirectory: string
}

export default async function uploadFileToServer({
  consortiumId,
  runId,
  path_baseDirectory,
}: UploadParameters): Promise<void> {
  const { fileServerUrl, accessToken } = await getConfig()
  const url = `${fileServerUrl}/upload/${consortiumId}/${runId}`
  const zipPath = path.join(
    path_baseDirectory,
    'runs',
    consortiumId,
    runId,
    'hosting',
    `${runId}.zip`,
  )
  const extractPath = path.join(
    path_baseDirectory,
    'runs',
    consortiumId,
    runId,
    'hosting',
  )

  try {
    await zipDirectory(extractPath, zipPath)
    await validateZipFile(zipPath)
    await uploadZipFile(url, zipPath, accessToken)
    console.log('File uploaded successfully')
  } catch (error) {
    console.error('Error during file upload:', error)
    throw error // Properly propagate errors
  }
}

async function validateZipFile(zipPath: string): Promise<void> {
  console.log(`Validating zip file at ${zipPath}...`)
  const fileStats = await fs.stat(zipPath)
  if (fileStats.size === 0) {
    throw new Error('Zip file is empty')
  }
  console.log('Zip file validation successful')
}

async function uploadZipFile(
  url: string,
  zipPath: string,
  accessToken: string,
): Promise<void> {
  const formData = new FormData()
  formData.append('file', createReadStream(zipPath))

  console.log('Starting file upload...')

  const maxRetries = 3
  let attempt = 0
  let success = false

  while (attempt < maxRetries && !success) {
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'x-access-token': accessToken,
          ...formData.getHeaders(),
        },
      })

      if (response.status === 200) {
        success = true
        console.log('File uploaded successfully')
      } else {
        throw new Error(`Failed to upload file: ${response.statusText}`)
      }
    } catch (error) {
      attempt++
      if (attempt >= maxRetries) {
        console.error('File upload failed after multiple attempts:', error)
        throw error
      } else {
        console.warn(`Retrying file upload (${attempt}/${maxRetries})...`)
      }
    }
  }
}

// async function cleanupTempFile(filePath: string): Promise<void> {
//   try {
//     await fs.unlink(filePath)
//     console.log('Temporary zip file deleted')
//   } catch (error) {
//     console.error('Failed to delete temporary zip file:', error)
//   }
// }

export async function zipDirectory(
  sourceDir: string,
  outPath: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const outputDir = path.dirname(outPath)
    try {
      await fs.mkdir(outputDir, { recursive: true }) // Ensure the directory exists
    } catch (err) {
      return reject(`Failed to create directory ${outputDir}: ${err}`)
    }

    const output = createWriteStream(outPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(`Archived ${archive.pointer()} total bytes.`)
      resolve()
    })

    output.on('end', () => {
      console.log('Data has been drained')
    })

    archive.on('error', (err) => {
      console.error('Archiving error:', err)
      reject(err)
    })

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archiving warning:', err)
      } else {
        console.error('Archiving warning:', err)
        reject(err)
      }
    })

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}
