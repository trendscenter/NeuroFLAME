interface CreateRunKitsArgs {
  startupKitsPath: string
  outputDirectory: string
  computationParameters: JSON
}

export function createRunKits({
  startupKitsPath,
  outputDirectory,
  computationParameters,
}: CreateRunKitsArgs) {
  console.log('Running createRunKits command')
}
