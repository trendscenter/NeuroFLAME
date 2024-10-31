import { Config } from './electronApi'

export const getConfig = async (): Promise<Config | undefined> => {
  const config = await window.ElectronAPI.getConfig()
  return config
}
