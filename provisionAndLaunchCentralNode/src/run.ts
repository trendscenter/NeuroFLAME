import { launchNode } from './launchNode'
import { startRun } from './startRun'
import path from 'path'

async function run() {
  const runId = Math.random().toString(36).substring(7)
  const consortiumId = 'consortium1'
  const userIds = ['user1', 'user2']

  await startRun({
    imageName: 'boilerplate_average_app',
    userIds: userIds,
    consortiumId: consortiumId,
    runId: runId,
    computationParameters: JSON.stringify({
      lambda: 0.1,
    }),
  })

  // launch edge node for site 1
  const hostDirectorySite1 = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'runKits',
    userIds[0],
  )

    const commandsToRun = ['bash', '-c', '/workspace/runKit/startup/start.sh && tail -f /dev/null']

  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: hostDirectorySite1,
        containerDirectory: '/workspace/runKit/',
      },
    ],
    portBindings: [],
    commandsToRun: commandsToRun,
  })

  // launch edge node for site 2
  const hostDirectorySite2 = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'runKits',
    userIds[1],
  )

  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: hostDirectorySite2,
        containerDirectory: '/workspace/runKit/',
      },
    ],
    portBindings: [],
    commandsToRun: commandsToRun,
  })
}

run()
