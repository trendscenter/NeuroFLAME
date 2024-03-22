import { launchNode } from './launchNode'
import { startRun } from './startRun'
import path from 'path'
import fs from 'fs'

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

  const commandsToRun = [
    'bash',
    '-c',
    '/workspace/runKit/startup/start.sh && tail -f /dev/null',
  ]
  // launch edge node for site 1
  const site1hostRunKitDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'runKits',
    userIds[0],
  )

  const site1hostDataDirectory = path.join(
    'C:/development/nvflare_app_boilerplate/test_data/site1',
  )

  const site1ResultsDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'results',
    userIds[0],
  )
  // make the directory if it doesn't exist
  if (!fs.existsSync(site1ResultsDirectory)) {
    fs.mkdirSync(site1ResultsDirectory, { recursive: true })
  }

  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: site1hostRunKitDirectory,
        containerDirectory: '/workspace/runKit/',
      },
      {
        hostDirectory: site1hostDataDirectory,
        containerDirectory: '/workspace/data/',
      },
      {
        hostDirectory: site1ResultsDirectory,
        containerDirectory: '/workspace/results/',
      }
    ],
    portBindings: [],
    commandsToRun: commandsToRun,
  })

  // launch edge node for site 2
  const site2hostRunKitDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'runKits',
    userIds[1],
  )

  const site2hostDataDirectory = path.join(
    'C:/development/nvflare_app_boilerplate/test_data/site2',
  )

  const site2ResultsDirectory = path.join(
    __dirname,
    '../../basedir/runs/',
    consortiumId,
    runId,
    'results',
    userIds[1],
  )
  // make the directory if it doesn't exist
  if (!fs.existsSync(site2ResultsDirectory)) {
    fs.mkdirSync(site2ResultsDirectory, { recursive: true })
  }

  await launchNode({
    containerService: 'docker',
    imageName: 'boilerplate_average_app',
    directoriesToMount: [
      {
        hostDirectory: site2hostRunKitDirectory,
        containerDirectory: '/workspace/runKit/',
      },
      {
        hostDirectory: site2hostDataDirectory,
        containerDirectory: '/workspace/data/',
      },
      {
        hostDirectory: site2ResultsDirectory,
        containerDirectory: '/workspace/results/',
      }
    ],
    portBindings: [],
    commandsToRun: commandsToRun,
  })
}

run()
