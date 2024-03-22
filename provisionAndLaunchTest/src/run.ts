import { launchNode } from './launchNode'
import { centralHandleStartRunEvent } from './centralHandleStartRunEvent'
import path from 'path'
import fs from 'fs/promises'

async function run() {
  const runId = Date.now().toString()
  const consortiumId = 'consortium1'
  const userIds = ['site1', 'site2']

  await centralHandleStartRunEvent({
    imageName: 'boilerplate_average_app',
    userIds: userIds,
    consortiumId: consortiumId,
    runId: runId,
    computationParameters: JSON.stringify({ lambda: 0.1 }),
  })

  const commandsToRun = [
    'bash',
    '-c',
    '/workspace/runKit/startup/start.sh && tail -f /dev/null',
  ]

  // Launch edge nodes for each site
  for (const userId of userIds) {
    await launchEdgeNode(consortiumId, runId, userId, commandsToRun)
  }
}

// Function to launch edge node for a given site
async function launchEdgeNode(
  consortiumId: string,
  runId: string,
  userId: string,
  commandsToRun: string[],
) {
  const hostRunKitDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'runKits',
    userId,
  )

  const hostDataDirectory = path.join(
    `C:/development/nvflare_app_boilerplate/test_data/${userId}`,
  )
  const resultsDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'results',
    userId,
  )

  // Ensure results directory exists
  await fs.mkdir(resultsDirectory, { recursive: true })

  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: hostRunKitDirectory,
        containerDirectory: '/workspace/runKit/',
      },
      {
        hostDirectory: hostDataDirectory,
        containerDirectory: '/workspace/data/',
      },
      {
        hostDirectory: resultsDirectory,
        containerDirectory: '/workspace/results/',
      },
    ],
    portBindings: [],
    commandsToRun,
  })
}

run().catch(console.error) // Proper error handling
