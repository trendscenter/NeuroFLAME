import path from 'path'
import { generateProjectFile } from './generateProjectFile'
import { createStartupKits } from './createStartupKits'
import { launchCentralNode } from './launchCentralNode'
import { createRunKits } from './createRunKits'
import { findOpenPort, reservePort } from './portManagement'

interface StartRunArgs {
  imageName: string
  userIds: string[]
  consortiumId: string
  runId: string
  computationParameters: JSON
}

export async function startRun({
  imageName,
  userIds,
  consortiumId,
  runId,
  computationParameters,
}: StartRunArgs) {
  console.log('Running startRun command')

  const baseDirectory = '/baseDirectory'
  const runDirectory = path.join(baseDirectory, 'runs', consortiumId, runId)

  const fed_learn_port = await findOpenPort()
  const admin_port = await findOpenPort()

  // Keep these ports available for the central node
  const fed_learn_server = await reservePort(fed_learn_port)
  const admin_server = await reservePort(admin_port)

  const FQDN = 'host.docker.internal'

  generateProjectFile({
    projectName: 'project',
    FQDN: FQDN,
    fed_learn_port: fed_learn_port,
    admin_port: admin_port,
    outputFilePath: path.join(runDirectory, 'Project.yml'),
    siteNames: userIds,
  })

  createStartupKits({
    projectFilePath: path.join(runDirectory, 'Project.yml'),
    outputDirectory: path.join(runDirectory, 'startupKits'),
  })

  createRunKits({
    startupKitsPath: path.join(runDirectory, 'startupKits'),
    outputDirectory: path.join(runDirectory, 'runKits'),
    computationParameters: computationParameters,
  })

  const containerService = 'docker'
  const directoriesToMount = [
    {
      hostDirectory: path.join(runDirectory, 'runKits', 'centralNode'),
      containerDirectory: '/runKit/',
    },
  ]

  const commandsToRun = [
    './runKits/server/start.sh',
    './runKits/admin/fl_admin.sh',
    'submit_job job',
  ]

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
  fed_learn_server.close()
  admin_server.close()

  launchCentralNode({
    containerService: containerService,
    imageName: imageName,
    directoriesToMount: directoriesToMount,
    portBindings: portBindings,
    commandsToRun: commandsToRun,
  })
}
