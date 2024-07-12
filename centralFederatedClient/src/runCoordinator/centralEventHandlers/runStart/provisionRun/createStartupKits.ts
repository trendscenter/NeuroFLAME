import Docker from 'dockerode'

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

    console.log('Container started. Waiting for completion...')

    // Optionally, wait for the container to finish and capture the result
    const containerEndStatus = await container.wait()
    console.log(
      `Container exited with status code: ${containerEndStatus.StatusCode}`,
    )

    // Remove the container after completion to clean up
    await container.remove()
    console.log('Docker task completed successfully and container removed.')
  } catch (error) {
    console.error('Failed to execute Docker command:', error)
    throw error // Propagate the error for further handling
  }
}
