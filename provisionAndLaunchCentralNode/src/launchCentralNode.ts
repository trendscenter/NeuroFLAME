import Docker from 'dockerode'
const docker = new Docker()

interface LaunchCentralNodeArgs {
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

export async function launchCentralNode({
  containerService,
  imageName,
  directoriesToMount,
  portBindings,
  commandsToRun,
}: LaunchCentralNodeArgs) {
  if (containerService === 'docker') {
    console.log('Running docker command')

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
      console.log(`Container started successfully: ${container.id}`)
    } catch (error) {
      console.error(`Failed to launch Docker container: ${error}`)
      throw error
    }
  } else if (containerService === 'singularity') {
    // Placeholder for singularity command handling
    console.log('Singularity handling not implemented.')
  }
}
