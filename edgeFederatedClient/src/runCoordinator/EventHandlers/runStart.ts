import { getConfig } from '../../config/getConfig.js'
import inMemoryStore from '../../inMemoryStore.js'
import downloadFile from '../downloadFile.js'
import { launchNode } from '../launchNode.js'
import path from 'path'
import { unzipFile } from '../unzipFile.js'

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

    const { httpUrl, path_base_directory } = await getConfig()
    const accessToken = inMemoryStore.get('accessToken')

    // get the destination path for the runKit on the local machine
    const runKitPath = path.join(path_base_directory, consortiumId, runId)

    // download the runkit to the appropriate directory
    await downloadFile({
      url: downloadUrl,
      accessToken: downloadToken,
      path_output_dir: runKitPath,
      outputFilename: 'kit.zip',
    })

    // unzip the file
    await unzipFile(runKitPath, 'kit.zip')
    
    // mount the runkit directory
    const directoriesToMount = [
      {
        hostDirectory: runKitPath,
        containerDirectory: '/workspace/runKit',
      },
    ]

    // mount the data directory

    launchNode({
      containerService: 'docker',
      imageName,
      directoriesToMount,
      portBindings: [],
      commandsToRun: ['python', '/workspace/entry_edge.py'],
    })
  },
}
