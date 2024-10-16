import { Config } from './electronApi'

export const FetchConfig = async (): Promise<Config | undefined> => {
    try {
      const config = await window.ElectronAPI.getConfig()
      return config
    } catch (error) {
      console.error('Failed to load configuration:', error)
      return undefined
    }
  }
  