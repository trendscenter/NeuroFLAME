const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  getConfig: async () => ipcRenderer.invoke('getConfig'),
  saveConfig: async (config) => ipcRenderer.invoke("saveConfig", config)
});
