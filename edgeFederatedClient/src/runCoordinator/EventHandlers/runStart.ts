import { getConfig } from '../../config/getConfig.js'
import downloadFile from '../downloadFile.js'
import { launchNode } from '../launchNode.js'
import path from 'path'
import { unzipFile } from '../unzipFile.js'
import fs from 'fs/promises'

export const RUN_START_SUBSCRIPTION = `
subscription runStartSubscription {
    runStartEdge {
        consortiumId
        runId
        imageName
        downloadUrl
        downloadToken
    }
}`

export const runStartHandler = {
  error: (err: any) => console.error('Run Start - Subscription error:', err),
  complete: () => console.log('Run Start - Subscription completed'),
  next: async ({ data }: { data: any }) => {
    const {
      consortiumId,
      runId,
      imageName,
      downloadUrl,
      downloadToken,
    } = data.runStartEdge

    const { path_base_directory } = await getConfig()

    const consortiumPath = path.join(path_base_directory, consortiumId)
    const runPath = path.join(consortiumPath, runId)
    const runKitPath = path.join(runPath, 'runKit')
    const resultsPath = path.join(runPath, 'results')

    // make sure all of these paths exist
    await fs.mkdir(consortiumPath, { recursive: true })
    await fs.mkdir(runPath, { recursive: true })
    await fs.mkdir(runKitPath, { recursive: true })
    await fs.mkdir(resultsPath, { recursive: true })
    
    const mountConfigPath = path.join(consortiumPath, 'mount_config.json')

    // download the runkit to the appropriate directory
    await downloadFile({
      url: downloadUrl,
      accessToken: downloadToken,
      path_output_dir: runKitPath,
      outputFilename: 'kit.zip',
    })

    // unzip the file
    await unzipFile(runKitPath, 'kit.zip')

    const directoriesToMount = []
    // mount the runkit directory
    directoriesToMount.push({
      hostDirectory: runKitPath,
      containerDirectory: '/workspace/runKit',
    })

    // find where the data path is defined for this consortium
    // load the json file that defines the data path from the consortium directory
    const mountConfig = JSON.parse(await fs.readFile(mountConfigPath, 'utf-8'))
    const dataPath = mountConfig.dataPath

    // mount the data path
    directoriesToMount.push({
      hostDirectory: dataPath,
      containerDirectory: '/workspace/data',
    })

    // mount the results path
    directoriesToMount.push({
      hostDirectory: resultsPath,
      containerDirectory: '/workspace/results',
    })

    launchNode({
      containerService: 'docker',
      imageName,
      directoriesToMount,
      portBindings: [],
      commandsToRun: ['python', '/workspace/entry_edge.py'],
    })
  },
}
