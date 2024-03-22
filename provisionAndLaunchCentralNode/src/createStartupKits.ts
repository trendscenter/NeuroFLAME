import { launchNode } from './launchNode' // Assuming both files are in the same directory

interface CreateStartupKitsArgs {
  projectFilePath: string
  outputDirectory: string
}

export async function createStartupKits({
  projectFilePath,
  outputDirectory,
}: CreateStartupKitsArgs): Promise<void> {
 
  const provisionImageName = 'nvflare-provisioner'
  const commandsToRun = [
    'nvflare',
    'provision',
    '-p',
    '/project/Project.yml',
    '-w',
    '/outputDirectory',
  ]

  // Use launchNode to start the Docker container
  await launchNode({
    containerService: 'docker',
    imageName: provisionImageName,
    directoriesToMount: [
      {
        hostDirectory: projectFilePath,
        containerDirectory: '/project/Project.yml',
      },
      {
        hostDirectory: outputDirectory,
        containerDirectory: '/outputDirectory',
      },
    ],
    portBindings: [], // Assuming no port bindings are needed for this operation
    commandsToRun: commandsToRun,
  })
}
