import { FetchConfig } from "./FetchConfig";

export interface Config {
  centralServerQueryUrl: string;
  centralServerSubscriptionUrl: string;
  edgeClientQueryUrl: string;
  edgeClientSubscriptionUrl: string;
  edgeClientRunResultsUrl: string;
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
  getConfigPath: () => Promise<string>;
  getConfig: () => Promise<Config>;
  openConfig: (filePath?: string) => Promise<void>;
  applyDefaultConfig: () => Promise<void>;
  useDirectoryDialog: (pathString?: string) => Promise<{ directoryPath: undefined | string, canceled: boolean, error: string | null }>;
}

declare global {
  interface Window {
    ElectronAPI: ElectronAPI;
  }
}

export const electronApi = {
  FetchConfig
}


