import Docker from 'dockerode'
import {logger} from '../logger.js'
const docker = new Docker()

interface LaunchNodeArgs {
  containerService: string
  imageName: string
  directoriesToMount: Array<{
    hostDirectory: string
    containerDirectory: string
  }>
  portBindings: Array<{
    hostPort: number
    containerPort: number
  }>
  commandsToRun: string[]
}

interface ExposedPorts {
  [portWithProtocol: string]: {} // Correctly defined for exposing ports
}

interface PortBindings {
  [portWithProtocol: string]: Array<{ HostPort: string }> // Define port bindings with HostPort as string
}

export async function launchNode({
  containerService,
  imageName,
  directoriesToMount,
  portBindings,
  commandsToRun,
}: LaunchNodeArgs) {
  if (containerService === 'docker') {
    logger.info('Running docker command')

    const binds = directoriesToMount.map(
      (mount) => `${mount.hostDirectory}:${mount.containerDirectory}`,
    )
    const ExposedPorts: ExposedPorts = {}
    const PortBindings: PortBindings = {}

    portBindings.forEach((binding) => {
      const containerPort = `${binding.containerPort}/tcp`
      ExposedPorts[containerPort] = {} // Just expose the port
      PortBindings[containerPort] = [{ HostPort: `${binding.hostPort}` }] // Correctly format as string
    })

    try {
      const container = await docker.createContainer({
        Image: imageName,
        Cmd: commandsToRun,
        ExposedPorts,
        HostConfig: {
          Binds: binds,
          PortBindings,
        },
      })

      await container.start()
      logger.info(`Container started successfully: ${container.id}`)
    } catch (error) {
      logger.error(`Failed to launch Docker container: ${error}`)
      throw error
    }
  } else if (containerService === 'singularity') {
    // Placeholder for singularity command handling
    logger.info('Singularity handling not implemented.')
  }
}
