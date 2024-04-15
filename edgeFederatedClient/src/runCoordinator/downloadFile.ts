import axios from 'axios'
import fs from 'fs'


export default async function ({
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
