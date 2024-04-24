import defaultConfig from './defaultConfig.js'

interface CentralApiConfig {
  fileServerUrl: string
  apolloPort: number
  databaseDetails: {
    url: string
    user: string
    pass: string
  }
}

export default function getConfig(): CentralApiConfig {
  return defaultConfig
}
