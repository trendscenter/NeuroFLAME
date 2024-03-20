import Docker from 'dockerode';
import fs from 'fs/promises'; // Use fs promises API for async/await support
import path from 'path';

const docker = new Docker();

interface CreateStartupKitsArgs {
  projectFilePath: string;
  outputDirectory: string;
}

export async function createStartupKits({
  projectFilePath,
  outputDirectory,
}: CreateStartupKitsArgs): Promise<void> { // Ensure the function returns Promise<void>
  const provisionImageName = 'nvflare-provisioner';

  // Ensure the output directory is an absolute path
  const outputDirPath = path.resolve(outputDirectory);

  try {
    // Ensure the project file path is valid and obtain its absolute path
    // Switching to async version of fs.exists
    if (!await fs.stat(projectFilePath).catch(() => false)) {
      throw new Error(`Project file does not exist at path: ${projectFilePath}`);
    }
    const projectFilePathAbsolute = path.resolve(projectFilePath);

    // Create container options
    const containerOptions = {
      Image: provisionImageName,
      Cmd: ['nvflare', 'provision', '-p', '/project/Project.yml', '-w', '/outputDirectory'],
      HostConfig: {
        Binds: [
          `${projectFilePathAbsolute}:/project/Project.yml`,
          `${outputDirPath}:/outputDirectory`
        ],
      },
    };

    // Create and start the container
    const container = await docker.createContainer(containerOptions);
    await container.start();

    console.log('Container started. Waiting for completion...');

    // Wait for the container to finish and capture the result
    const containerEndStatus = await container.wait();
    console.log(`Container exited with status code: ${containerEndStatus.StatusCode}`);

    // Optionally, log output if needed (omitting in this implementation for simplicity)
    
    // Remove the container after completion
    await container.remove();
    console.log('Docker task completed successfully and container removed.');
  } catch (error) {
    console.error('Failed to execute Docker command:', error);
    throw error; // Propagate error to allow further handling if needed
  }
}
