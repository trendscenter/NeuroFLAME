const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  getConfig: async () => ipcRenderer.invoke('getConfig'),
  openConfig: async (filePath) => ipcRenderer.invoke("openConfig"),
  applyDefaultConfig: async () => ipcRenderer.invoke("applyDefaultConfig"),
  getConfigPath: async () => ipcRenderer.invoke("getConfigPath"),
  useDirectoryDialog: async () => ipcRenderer.invoke("useDirectoryDialog"),
});
