import { getConfig } from '../../config/config.js'
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
    console.log('Run Start - Received data')
    try {
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

      // Ensure all paths exist and are writable and executable
      await fs.mkdir(consortiumPath, { recursive: true, mode: 0o777 })
      await fs.mkdir(runPath, { recursive: true, mode: 0o777 })
      await fs.mkdir(runKitPath, { recursive: true, mode: 0o777 })
      await fs.mkdir(resultsPath, { recursive: true, mode: 0o777 })

      const mountConfigPath = path.join(consortiumPath, 'mount_config.json')

      // Download the runkit to the appropriate directory
      await downloadFile({
        url: downloadUrl,
        accessToken: downloadToken,
        path_output_dir: runKitPath,
        outputFilename: 'kit.zip',
      })

      // Unzip the file
      try {
        await unzipFile(runKitPath, 'kit.zip')
      } catch (e: any) {
        throw new Error(
          `Error unzipping the file: ${e.message || e.toString()}`,
        )
      }

      // Prepare directories to mount
      const directoriesToMount = [
        {
          hostDirectory: runKitPath,
          containerDirectory: '/workspace/runKit',
        },
        {
          hostDirectory: resultsPath,
          containerDirectory: '/workspace/results',
        },
      ]

      // Load mount configuration and add data path
      try {
        const mountConfig = JSON.parse(
          await fs.readFile(mountConfigPath, 'utf-8'),
        )
        const dataPath = mountConfig.dataPath
        directoriesToMount.push({
          hostDirectory: dataPath,
          containerDirectory: '/workspace/data',
        })
      } catch (e) {
        console.error('Failed to read or parse mount configuration:', e)
        throw new Error('Failed to load mount configuration')
      }

      // Launch the node
      launchNode({
        containerService: 'docker',
        imageName,
        directoriesToMount,
        portBindings: [],
        commandsToRun: ['python', '/workspace/entry_edge.py'],
      })
    } catch (error) {
      console.error('Error in runStartHandler:', error)
    }
  },
}
