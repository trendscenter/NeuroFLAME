import getConfig from '../config/getConfig'
import inMemoryStore from '../inMemoryStore'
import axios from 'axios'
import fs from 'fs'

import path from 'path'

// Adjust the downloadFile function to accept an accessToken for the request header
export default async function({
  url,
  outputPath,
  accessToken, // Add accessToken to the parameters
}: {
  url: string
  outputPath: string
  accessToken: string // Ensure accessToken is passed as a parameter
}) {
  const response = await axios({
    method: 'POST',
    url: url,
    headers: {
      'x-access-token': accessToken, // Set the x-access-token header
    },
    responseType: 'stream',
  })

  const writer = fs.createWriteStream(outputPath)
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
