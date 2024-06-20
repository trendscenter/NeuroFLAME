export interface edgeClientLaunchConfiguration {
  httpUrl: string
  wsUrl: string
  path_base_directory: string
  authenticationEndpoint: string
  hostingPort: number
}

// Holds the configuration instance, initially set to null
let config: edgeClientLaunchConfiguration

export function getConfig(): edgeClientLaunchConfiguration {
  return config
}

export function setConfig(newConfig: edgeClientLaunchConfiguration): void {
  config = newConfig
}
