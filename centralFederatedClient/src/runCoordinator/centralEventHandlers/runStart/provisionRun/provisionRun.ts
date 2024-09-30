import path from 'path'
import fs from 'fs'
import { generateProjectFile } from './generateProjectFile.js'
import { createStartupKits } from './createStartupKits.js'
import { createRunKits } from './createRunKits.js'
import { prepareHostingDirectory } from './prepareHostingDirectory.js'
import { launchNode } from '../launchNode.js'

interface provisionRunArgs {
  image_name: string
  userIds: string[]
  path_run: string
  computationParameters: string
  fed_learn_port: number
  admin_port: number
  FQDN: string
}

export async function provisionRun({
  image_name,
  userIds,
  computationParameters,
  path_run,
  fed_learn_port,
  admin_port,
  FQDN,
}: provisionRunArgs) {


  
  const path_hosting = path.join(path_run, 'hosting')

  await ensureDirectoryExists(path_run)
  await ensureDirectoryExists(path_hosting)
  
  // make the input
  const provision_input = {
    userIds,
    computationParameters,
    fed_learn_port,
    admin_port,
    host_identifier: FQDN,
  }

  // save the file
  const path_provision_input = path.join(path_run, 'provision_input.json')
  await fs.promises.writeFile(path_provision_input, JSON.stringify(provision_input, null, 2))

  await launchNode({
    containerService: 'docker',
    imageName: image_name,
    directoriesToMount: [
      { hostDirectory: path_provision_input, containerDirectory: '/provisioning/input/provision_input.json' },
      { hostDirectory: path_hosting, containerDirectory: '/provisioning/output/' },
    ],
    portBindings: [
      { hostPort: fed_learn_port, containerPort: fed_learn_port },
      { hostPort: admin_port, containerPort: admin_port },
    ],
    commandsToRun: [
      `python3 entry_provision.py`,
    ],
  })
  // launch the container
  // wait for it to finish


}

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(directoryPath, { recursive: true })
    // logger.info(`Directory ensured: ${directoryPath}`)
  } catch (error) {
    if ((error as { code?: string }).code === 'EEXIST') {
      return
    }
    throw error
  }
}
