import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

interface ZipAndMoveArgs {
  sourceDir: string;
  targetDir: string;
}

export async function zipAndMove({ sourceDir, targetDir }: ZipAndMoveArgs) {
  // Ensure targetDir exists
  await fs.promises.mkdir(targetDir, { recursive: true });

  const directories = await fs.promises.readdir(targetDir, { withFileTypes: true });
  const folderNames = directories.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  for (const folderName of folderNames) {
    const outputZipPath = path.join(sourceDir, `${folderName}.zip`);
    const folderPath = path.join(targetDir, folderName);
    
    await createZipFromFolder(folderPath, outputZipPath);
  }
}

async function createZipFromFolder(sourceFolder: string, outputZipPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
    });

    output.on('close', () => resolve());
    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);
    archive.directory(sourceFolder, false);
    archive.finalize();
  });
}
