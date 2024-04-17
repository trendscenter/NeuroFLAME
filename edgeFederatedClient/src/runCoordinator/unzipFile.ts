// Import necessary modules
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Unzips a file to a specified directory.
 * 
 * @param directory The directory where the zip file is located.
 * @param fileName The name of the zip file to unzip.
 */
export async function unzipFile(directory: string, fileName: string): Promise<void> {
  const zipPath = path.join(directory, fileName);

  return fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: directory }))
    .promise();
}
