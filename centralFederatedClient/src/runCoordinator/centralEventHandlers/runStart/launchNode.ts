import Docker from 'dockerode'
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
    await launchDockerNode({
      containerService,
      imageName,
      directoriesToMount,
      portBindings,
      commandsToRun,
    })
  } else if (containerService === 'singularity') {
    // Placeholder for singularity command handling
    console.log('Singularity handling not implemented.')
  }
}

const launchDockerNode = async ({
  containerService,
  imageName,
  directoriesToMount,
  portBindings,
  commandsToRun,
}: LaunchNodeArgs) => {
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
    // create the container
    const container = await docker.createContainer({
      Image: imageName,
      Cmd: commandsToRun,
      ExposedPorts,
      HostConfig: {
        Binds: binds,
        PortBindings,
      },
    })

    // start the container
    await container.start()
    console.log(`Container started successfully: ${container.id}`)

    // add event handlers for the container
    docker.getEvents((err, stream) => {
      if (err) {
        console.error(`Error getting Docker events: ${err}`)
        return
      }
      stream?.on('data', async (chunk) => {
        const event = JSON.parse(chunk.toString())

        if (event.Type === 'container' && event.Action === 'die') {
          console.log(
            `Container ${event.id} stopped with exit code: ${event.Actor.Attributes.exitCode}`,
          )
          if (parseInt(event.Actor.Attributes.exitCode, 10) !== 0) {
            console.error(`Container ${event.id} stopped due to an error`)
          } else {
            console.log(`Container ${event.id} stopped gracefully`)
          }
        }

        if (event.Type === 'container' && event.Action === 'stop') {
          console.log(`Container ${event.id} stopped gracefully`)
        }
      })

      stream?.on('error', (err) => {
        console.error(`Event stream error: ${err}`)
      })
    })

    // return the container ID
    return container.id
  } catch (error) {
    console.error(`Failed to launch Docker container: ${error}`)
    throw error
  }
}
