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

  // launch edge node
  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: path.join(
          '../basedir/runs/',
          consortiumId,
          runId,
          'runKits',
          userIds[0],
        ),
        containerDirectory: '/workspace/runKit/',
      },
    ],
    portBindings: [],
    commandsToRun: ["tail -f /dev/null"],
  })
}

run()
