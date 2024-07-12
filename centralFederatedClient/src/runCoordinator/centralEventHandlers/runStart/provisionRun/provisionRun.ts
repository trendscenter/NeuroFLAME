import path from 'path'
import fs from 'fs'
import { generateProjectFile } from './generateProjectFile.js'
import { createStartupKits } from './createStartupKits.js'
import { createRunKits } from './createRunKits.js'
import { prepareHostingDirectory } from './prepareHostingDirectory.js'

interface provisionRunArgs {
  userIds: string[]
  path_run: string
  computationParameters: string
  fed_learn_port: number
  admin_port: number
  FQDN: string
}

export async function provisionRun({
  userIds,
  computationParameters,
  path_run,
  fed_learn_port,
  admin_port,
  FQDN,
}: provisionRunArgs) {
  // these variables will be configurable by environment variables or config

  const adminName = 'admin@admin.com'


  const path_startupKits = path.join(path_run, 'startupKits/')
  const path_runKits = path.join(path_run, 'runKits/')
  const path_hosting = path.join(path_run, 'hosting/')

  // Ensure all necessary directories are created
  await ensureDirectoryExists(path_run)
  await ensureDirectoryExists(path_startupKits)
  await ensureDirectoryExists(path_runKits)

  await generateProjectFile({
    projectName: 'project',
    FQDN: FQDN,
    fed_learn_port: fed_learn_port,
    admin_port: admin_port,
    outputFilePath: path.join(path_run, 'Project.yml'),
    siteNames: userIds,
  })

  await createStartupKits({
    projectFilePath: path.join(path_run, 'Project.yml'),
    outputDirectory: path.join(path_run, 'startupKits'),
  })

  await createRunKits({
    startupKitsPath: path.join(path_startupKits, 'project', 'prod_00'),
    outputDirectory: path_runKits,
    computationParameters: computationParameters,
    FQDN: FQDN,
    adminName: adminName,
  })

  // Zip and move the runKits to the hosting directory
  await prepareHostingDirectory({
    sourceDir: path_runKits,
    targetDir: path_hosting,
    exclude: ['centralNode'],
  })
}

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(directoryPath, { recursive: true })
    console.log(`Directory ensured: ${directoryPath}`)
  } catch (error) {
    if ((error as { code?: string }).code === 'EEXIST') {
      return
    }
    throw error
  }
}
