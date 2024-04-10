import defaultConfig from './defaultConfig.js'

interface FederatedClientLaunchConfiguration {
  httpUrl: string
  wsUrl: string
  path_base_directory: string
}

export default async function getConfig(): Promise<
  FederatedClientLaunchConfiguration
> {
  return defaultConfig
}
