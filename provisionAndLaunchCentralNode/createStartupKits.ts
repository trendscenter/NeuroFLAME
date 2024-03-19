interface CreateStartupKitsArgs {
    projectFilePath: string;
    outputDirectory: string;
}

export function createStartupKits({
    projectFilePath,
    outputDirectory,
  }: CreateStartupKitsArgs) {
      console.log("Running createStartupKits command");
  }
  