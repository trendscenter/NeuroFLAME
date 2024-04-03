import fs from 'fs'
import path from 'path'
import { generateProjectFile } from './generateProjectFile'
import { createStartupKits } from './createStartupKits'
import { launchNode } from './launchNode'
import { createRunKits } from './createRunKits'
import { reservePort } from './portManagement'
import { prepareHostingDirectory } from './prepareHostingDirectory'

interface centralHandleStartRunEventArgs {
  imageName: string
  userIds: string[]
  consortiumId: string
  runId: string
  computationParameters: string
}

export async function centralHandleStartRunEvent({
  imageName,
  userIds,
  consortiumId,
  runId,
  computationParameters,
}: centralHandleStartRunEventArgs) {
  console.log('Running startRun command')

  // These variables are likely to be passed in as environment variables
  const baseDirectory = path.join(
    'C:\\development\\effective-palm-tree\\',
    'basedir',
  )
  const FQDN = 'host.docker.internal'
  const adminName = 'admin@admin.com'
  //

  const runDirectory = path.join(baseDirectory, 'runs/', consortiumId, runId)
  const startupKitsPath = path.join(runDirectory, 'startupKits/')
  const runKitsPath = path.join(runDirectory, 'runKits/')
  const hostingDirectory = path.join(runDirectory, 'hosting/')

  // Ensure all necessary directories are created
  await ensureDirectoryExists(runDirectory)
  await ensureDirectoryExists(startupKitsPath)
  await ensureDirectoryExists(runKitsPath)

  const { port: fed_learn_port, server: fed_learn_server } = await reservePort()
  const { port: admin_port, server: admin_server } = await reservePort()

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
    outputDirectory: runKitsPath,
    computationParameters: computationParameters,
    FQDN: FQDN,
    adminName: adminName,
  })

  // Zip and move the runKits to the hosting directory
  await prepareHostingDirectory({
    sourceDir: runKitsPath,
    targetDir: hostingDirectory,
    exclude: ['centralNode'],
  })

  // Release the ports
  await fed_learn_server.close()
  await admin_server.close()

  console.log('launching central node')

  await launchNode({
    containerService: 'docker',
    imageName: imageName,
    directoriesToMount: [
      {
        hostDirectory: path.join(runDirectory, 'runKits', 'centralNode'),
        containerDirectory: '/runKit/',
      },
    ],
    portBindings: [
      {
        hostPort: fed_learn_port,
        containerPort: fed_learn_port,
      },
      {
        hostPort: admin_port,
        containerPort: admin_port,
      },
    ],
    commandsToRun: ['python', '/workspace/entry_central.py'],
  })

  console.log('central node launched')
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
