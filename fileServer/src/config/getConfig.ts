import defaultConfig from './defaultConfig.js'

interface fileServerConfiguration {
  authenticationUrl: string
  baseDir: string
  port: number
}

export default async function getConfig(): Promise<fileServerConfiguration> {
  return defaultConfig
}
