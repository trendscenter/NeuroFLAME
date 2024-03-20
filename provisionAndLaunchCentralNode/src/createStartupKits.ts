import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';

const docker = new Docker();

interface CreateStartupKitsArgs {
  projectFilePath: string;
  outputDirectory: string;
}

export async function createStartupKits({
  projectFilePath,
  outputDirectory,
}: CreateStartupKitsArgs) {
  const provisionImageName = 'nvflare-provisioner';
  
  // Ensure the output directory is an absolute path
  const outputDirPath = path.resolve(outputDirectory);

  try {
    // Ensure the project file path is valid and obtain its absolute path
    if (!fs.existsSync(projectFilePath)) {
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

    // Wait for the container to finish
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    stream.on('data', (data: any) => console.log(data.toString()));
    stream.on('end', async () => {
      console.log('Docker task completed successfully.');
      // Remove the container
      await container.remove();
    });
  } catch (error) {
    console.error('Failed to execute Docker command:', error);
    throw error;
  }
}
