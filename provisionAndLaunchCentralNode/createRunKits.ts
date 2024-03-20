interface CreateRunKitsArgs {
  startupKitsPath: string
  outputDirectory: string
  computationParameters: string
}

export async function createRunKits({
  startupKitsPath,
  outputDirectory,
  computationParameters,
}: CreateRunKitsArgs) {
  console.log('Running createRunKits command')
}
