const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  fetchAPI: (path, options) => ipcRenderer.invoke('fetch-api', path, options),
  patchAPI: (path, body) => ipcRenderer.invoke('patch-api', path, body),
})