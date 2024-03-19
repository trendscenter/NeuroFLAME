interface CreateKitsArgs {
    projectFilePath: string;
    outputDirectory: string;
}

export function createKits({
    projectFilePath,
    outputDirectory,
  }: CreateKitsArgs) {
      console.log("Running createKits command");
  }
  