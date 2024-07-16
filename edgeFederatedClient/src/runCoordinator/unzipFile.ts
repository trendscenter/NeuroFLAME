import * as unzipper from 'unzipper'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

// Promisify the necessary fs functions
const readdir = promisify(fs.readdir)
const chmod = promisify(fs.chmod)
const stat = promisify(fs.stat)

/**
 * Recursively sets permissions for all files and directories.
 *
 * @param dir - The directory to set permissions for.
 * @param mode - The permission mode to set.
 */
async function setPermissions(dir: string, mode: number): Promise<void> {
  const files = await readdir(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const fileStat = await stat(filePath)

    if (fileStat.isDirectory()) {
      await setPermissions(filePath, mode)
    } else {
      await chmod(filePath, mode)
    }
  }
}

/**
 * Unzips a file to a specified directory and sets permissions to 0o777 for all extracted files.
 *
 * @param directory - The directory where the zip file is located.
 * @param fileName - The name of the zip file to unzip.
 */
export async function unzipFile(
  directory: string,
  fileName: string,
): Promise<void> {
  const zipPath = path.join(directory, fileName)

  // Extract the zip file
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: directory }))
    .promise()

  // Recursively change the file permissions of all the extracted files to 0o777
  await setPermissions(directory, 0o777)
}
