import defaultConfig from './defaultConfig.js'

interface CentralApiConfig {
  fileServerUrl: string
}

export default function getConfig(): CentralApiConfig {
  return defaultConfig
}
