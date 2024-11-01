const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  getConfig: async () => ipcRenderer.invoke('getConfig'),
  openConfig: async () => ipcRenderer.invoke("openConfig"),
  applyDefaultConfig: async () => ipcRenderer.invoke("applyDefaultConfig"),
  saveConfig: async (config) => ipcRenderer.invoke("saveConfig", config),
  getConfigPath: async () => ipcRenderer.invoke("getConfigPath"),
  useDirectoryDialog: async (pathString) => ipcRenderer.invoke("useDirectoryDialog", pathString),
  restartApp: async () => ipcRenderer.invoke("restartApp"),
});

console.log("preload.js loaded");