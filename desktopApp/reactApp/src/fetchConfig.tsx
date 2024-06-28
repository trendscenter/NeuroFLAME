export interface Config {
    centralServerUrl: string;
    edgeClientUrl: string;
  }

  interface OpenFile {
    filepath: string;
    filelist: object;
  }
  
  interface ElectronAPI {
    getConfig: () => Promise<Config>;
    openFile: () => Promise<OpenFile>; 
  }
  
  declare global {
    interface Window {
      ElectronAPI: ElectronAPI;
    }
  }

export const fetchConfig = async (): Promise<Config | undefined> => {
  try {
    const config = await window.ElectronAPI.getConfig()
    return config
  } catch (error) {
    console.error('Failed to load configuration:', error)
    return undefined
  }
}
