import fetch from 'node-fetch'
import FormData from 'form-data'
import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import archiver from 'archiver'

import defaultConfig from '../../../config/defaultConfig.js'

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
  const { fileServerUrl, accessToken } = defaultConfig
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

    const formData = new FormData()
    formData.append('file', createReadStream(zipPath))

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        [`x-access-token`]: accessToken,
        ...formData.getHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to upload file to file server: ${response.statusText}`,
      )
    }

    console.log('File uploaded successfully')
  } catch (error) {
    console.error('Error during file upload:', error)
    throw error // Properly propagate errors
  } finally {
    try {
      await fs.unlink(zipPath) // Use async unlink
      console.log('Temporary zip file deleted')
    } catch (error) {
      console.error('Failed to delete temporary zip file:', error)
    }
  }
}

export async function zipDirectory(
  sourceDir: string,
  outPath: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const outputDir = path.dirname(outPath)
    try {
      await fs.mkdir(outputDir, { recursive: true }) // Ensure the directory exists
    } catch (err) {
      reject(`Failed to create directory ${outputDir}: ${err}`)
      return
    }

    const output = createWriteStream(outPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(`Archived ${archive.pointer()} total bytes.`)
      resolve()
    })

    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}
