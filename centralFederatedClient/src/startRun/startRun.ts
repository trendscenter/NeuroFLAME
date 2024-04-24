import path from 'path'
import { provisionRun } from './provisionRun/provisionRun.js'
import { reservePort } from './portManagement.js'
import { launchNode } from './launchNode.js'
import uploadToFileServer from './uploadToFileServer.js'
import defaultConfig from '../defaultConfig.js'

interface startRunArgs {
  imageName: string
  userIds: string[]
  consortiumId: string
  runId: string
  computationParameters: string
}
export default async function ({
  imageName,
  userIds,
  consortiumId,
  runId,
  computationParameters,
}: startRunArgs) {
  console.log('Starting run...')
  const path_baseDirectory = defaultConfig.baseDir

  const path_run = path.join(path_baseDirectory, 'runs/', consortiumId, runId)
  const path_centralNodeRunKit = path.join(path_run, 'runKits', 'centralNode')

  const { port: fed_learn_port, server: fed_learn_server } = await reservePort()
  const { port: admin_port, server: admin_server } = await reservePort()

  await provisionRun({
    userIds,
    path_run,
    computationParameters,
    fed_learn_port,
    admin_port,
  })

  await uploadToFileServer({
    consortiumId,
    runId,
    path_baseDirectory,
  })

  fed_learn_server.close()
  admin_server.close()

  // launch the node
  await launchNode({
    containerService: 'docker',
    imageName: imageName,
    directoriesToMount: [
      {
        hostDirectory: path_centralNodeRunKit,
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
}
