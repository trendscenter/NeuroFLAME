interface CreateStartupKitsArgs {
    projectFilePath: string;
    outputDirectory: string;
}

export async function createStartupKits({
    projectFilePath,
    outputDirectory,
  }: CreateStartupKitsArgs) {
      console.log("Running createStartupKits command");
  }
  