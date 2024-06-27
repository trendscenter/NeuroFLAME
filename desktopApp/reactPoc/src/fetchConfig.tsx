export interface Config {
  centralServerUrl: string;
  edgeClientUrl: string;
  startEdgeClientOnLaunch: boolean;
  edgeClientConfig: {
    httpUrl: string,
    wsUrl: string,
    path_base_directory: string,
    authenticationEndpoint: string,
    hostingPort: number
  }
}

interface ElectronAPI {
  getConfig: () => Promise<Config>;
  openConfig: (filePath?: string) => Promise<void>;
  applyDefaultConfig: () => Promise<void>;
  getConfigPath: () => Promise<string>;
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
