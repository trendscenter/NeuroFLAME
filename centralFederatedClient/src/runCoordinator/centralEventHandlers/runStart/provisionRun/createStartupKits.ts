import Docker from 'dockerode'
import logger from '../../../../logger.js'

const docker = new Docker() // Initialize a Dockerode client

interface CreateStartupKitsArgs {
  projectFilePath: string
  outputDirectory: string
}

export async function createStartupKits({
  projectFilePath,
  outputDirectory,
}: CreateStartupKitsArgs): Promise<void> {
  const provisionImageName = 'nvflare-pt'

  const Binds = [
    `${projectFilePath}:/project/Project.yml`,
    `${outputDirectory}:/outputDirectory`,
  ]

  // Define container options
  const containerOptions = {
    Image: provisionImageName,
    Cmd: [
      'nvflare',
      'provision',
      '-p',
      '/project/Project.yml',
      '-w',
      '/outputDirectory',
    ],
    HostConfig: {
      Binds,
    },
  }

  try {
    // Create and start the Docker container
    const container = await docker.createContainer(containerOptions)
    await container.start()

    logger.info('Container started. Waiting for completion...')

    // Optionally, wait for the container to finish and capture the result
    const containerEndStatus = await container.wait()
    logger.info(
      `Container exited with status code: ${containerEndStatus.StatusCode}`,
    )

    // Remove the container after completion to clean up
    await container.remove()
    logger.info('Docker task completed successfully and container removed.')
  } catch (error) {
    logger.error('Failed to execute Docker command:', error)
    throw error // Propagate the error for further handling
  }
}
