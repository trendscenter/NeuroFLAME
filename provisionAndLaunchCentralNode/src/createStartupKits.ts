import { exec } from 'child_process'
import { promisify } from 'util'

// Promisify exec for use with async/await
const execP = promisify(exec)

interface CreateStartupKitsArgs {
  projectFilePath: string
  outputDirectory: string
}

export async function createStartupKits({
  projectFilePath,
  outputDirectory,
}: CreateStartupKitsArgs) {
  const provisionImageName = 'nvflare-provisioner'

  const command = `
        docker run --rm \
        -v "${projectFilePath}":/project/Project.yml \
        -v "${outputDirectory}":/outputDirectory \
        ${provisionImageName}\
        nvflare provision -p /project/Project.yml -w /outputDirectory
      `
      
  try {
    // Execute the Docker command
    const { stdout, stderr } = await execP(command)
    // Log output and errors (if any)
    if (stdout) console.log('Command stdout:', stdout)
    if (stderr) console.error('Command stderr:', stderr)
    console.log('Docker task completed successfully.')
  } catch (error) {
    console.error('Failed to execute Docker command:', error)
    throw error 
  }
}
