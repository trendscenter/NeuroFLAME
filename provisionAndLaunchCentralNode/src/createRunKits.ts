import path from 'path'
import fs from 'fs/promises'

interface CreateRunKitsArgs {
  startupKitsPath: string
  outputDirectory: string
  computationParameters: string
  FQDN: string
  adminName: string
}

export async function createRunKits({
  startupKitsPath,
  outputDirectory,
  computationParameters,
  FQDN,
  adminName,
}: CreateRunKitsArgs) {
  console.log('Running createRunKits command')

  try {
    // Ensure the output directory exists
    await fs.mkdir(outputDirectory, { recursive: true })

    const sites = await fs.readdir(startupKitsPath, { withFileTypes: true })
    const siteDirectories = sites
      .filter(
        (dirent) =>
          dirent.isDirectory() &&
          dirent.name !== FQDN &&
          dirent.name !== adminName,
      )
      .map((dirent) => dirent.name)

    // Copy each site's startupKit to the runKits directory
    for (const site of siteDirectories) {
      const sourcePath = path.join(startupKitsPath, site)
      const destinationPath = path.join(outputDirectory, site)
      await copyDirectory(sourcePath, destinationPath)
    }

    // Create the central node runKit
    const centralNodePath = path.join(outputDirectory, 'centralNode')
    await fs.mkdir(centralNodePath, { recursive: true })
    // Copy the server's startupKit to the central node runKit
    const serverStartupKitPath = path.join(startupKitsPath, FQDN)
    await copyDirectory(
      serverStartupKitPath,
      path.join(centralNodePath, 'server'),
    )
    // Copy the admin's startupKit to the central node runKit
    const adminStartupKitPath = path.join(startupKitsPath, adminName)
    await copyDirectory(
      adminStartupKitPath,
      path.join(centralNodePath, 'admin'),
    )
    // Create or modify computationParameters.json within the central node's runKit
    await fs.writeFile(
      path.join(centralNodePath, 'computationParameters.json'),
      computationParameters,
    )

    // Additional step: Create init.sh in the centralNode runKit directory
    const initScriptContent = `#!/bin/bash
        /runKit/server/startup/start.sh
        `

    const initScriptPath = path.join(centralNodePath, 'init.sh')
    await fs.writeFile(initScriptPath, initScriptContent, { mode: 0o755 }) // mode: 0o755 makes the script executable

    console.log('RunKits created successfully.')
  } catch (error) {
    console.error('Error creating runKits:', error)
    throw error // Rethrow or handle as needed
  }
}

// Helper function to copy directories recursively (simplified version)
async function copyDirectory(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true })
  let entries = await fs.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? await copyDirectory(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath)
  }
}
