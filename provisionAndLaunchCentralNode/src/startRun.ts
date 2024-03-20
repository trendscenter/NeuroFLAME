import fs from 'fs'
import path from 'path'
import { generateProjectFile } from './generateProjectFile'
import { createStartupKits } from './createStartupKits'
import { launchCentralNode } from './launchCentralNode'
import { createRunKits } from './createRunKits'
import { reservePort } from './portManagement'

interface StartRunArgs {
  imageName: string
  userIds: string[]
  consortiumId: string
  runId: string
  computationParameters: string
}

export async function startRun({
  imageName,
  userIds,
  consortiumId,
  runId,
  computationParameters,
}: StartRunArgs) {
  console.log('Running startRun command')
  // show the current path

  const baseDirectory = path.join(
    'C:\\development\\effective-palm-tree\\',
    'basedir',
  )
  const runDirectory = path.join(baseDirectory, 'runs/', consortiumId, runId)
  const startupKitsPath = path.join(runDirectory, 'startupKits/')
  const runKitsPath = path.join(runDirectory, 'runKits/')

  // Ensure all necessary directories are created
  await ensureDirectoryExists(runDirectory)
  await ensureDirectoryExists(startupKitsPath)
  await ensureDirectoryExists(runKitsPath)

  const { port: fed_learn_port, server: fed_learn_server } = await reservePort()
  const { port: admin_port, server: admin_server } = await reservePort()

  const FQDN = 'host.docker.internal'
  const adminName = 'admin@admin.com'

  await generateProjectFile({
    projectName: 'project',
    FQDN: FQDN,
    fed_learn_port: fed_learn_port,
    admin_port: admin_port,
    outputFilePath: path.join(runDirectory, 'Project.yml'),
    siteNames: userIds,
  })

  await createStartupKits({
    projectFilePath: path.join(runDirectory, 'Project.yml'),
    outputDirectory: path.join(runDirectory, 'startupKits'),
  })

  await createRunKits({
    startupKitsPath: path.join(
      runDirectory,
      'startupKits',
      'project',
      'prod_00',
    ),
    outputDirectory: path.join(runDirectory, 'runKits'),
    computationParameters: computationParameters,
    FQDN: FQDN,
    adminName: adminName,
  })

  const containerService = 'docker'
  const directoriesToMount = [
    {
      hostDirectory: path.join(runDirectory, 'runKits', 'centralNode'),
      containerDirectory: '/runKit/',
    },
  ]

  const commandsToRun = ['bash', '/runKit/init.sh']
  
  const portBindings = [
    {
      hostPort: fed_learn_port,
      containerPort: fed_learn_port,
    },
    {
      hostPort: admin_port,
      containerPort: admin_port,
    },
  ]

  // Release the ports
  await fed_learn_server.close()
  await admin_server.close()

  await launchCentralNode({
    containerService: containerService,
    imageName: imageName,
    directoriesToMount: directoriesToMount,
    portBindings: portBindings,
    commandsToRun: commandsToRun,
  })
}

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(directoryPath, { recursive: true })
    console.log(`Directory ensured: ${directoryPath}`)
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error // Rethrow the error if it's not about the directory already existing
    }
  }
}
