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

// // Update the main function to pass accessToken to downloadFile
// export default async function downloadRunKit({
//   consortiumId,
//   runId,
// }: {
//   consortiumId: string
//   runId: string
// }) {
//   try {
//     const { httpUrl, path_base_directory } = await getConfig()
//     const accessToken = inMemoryStore.get('accessToken') // Retrieve the accessToken

//     // Assuming fileName is derived from runId or another parameter if necessary
//     const fileName = 'example.zip'
//     // Note: Removed access_token from the query parameters as it's now set in the header
//     const endpoint = `${httpUrl}/downloadRunKit?consortiumId=${consortiumId}&runId=${runId}`

//     // Construct the local path where the file will be saved
//     const localPath = path.join(
//       path_base_directory,
//       consortiumId,
//       runId,
//       fileName,
//     )

//     // Pass the accessToken to downloadFile
//     await downloadFile({
//       url: endpoint,
//       outputPath: localPath,
//       accessToken, // Include the accessToken when calling downloadFile
//     })
//     console.log(`File downloaded successfully to ${localPath}`)
//   } catch (error) {
//     console.error('Failed to download the file:', error)
//   }
// }
