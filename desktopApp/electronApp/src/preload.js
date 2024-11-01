const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  getConfig: async () => ipcRenderer.invoke('getConfig'),
  openConfig: async () => ipcRenderer.invoke("openConfig"),
  applyDefaultConfig: async () => ipcRenderer.invoke("applyDefaultConfig"),
  getConfigPath: async () => ipcRenderer.invoke("getConfigPath"),
  useDirectoryDialog: async (pathString) => ipcRenderer.invoke("useDirectoryDialog", pathString),
});

console.log("preload.js loaded");