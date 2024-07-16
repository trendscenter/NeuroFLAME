import fs from 'fs-extra'
import unzipper from 'unzipper'

const zipPath = process.argv[3]
const extractPath = process.argv[4]

console.log({ zipPath, extractPath })

export function unzipIt({
    zipPath,
    extractPath,
  }: {
    zipPath: string
    extractPath: string
  }): Promise<void> {
    return fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise()
  }