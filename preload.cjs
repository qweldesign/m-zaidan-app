const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  fetchAPI: (path, options) => ipcRenderer.invoke('fetch-api', path, options),
  patchAPI: (path, body) => ipcRenderer.invoke('patch-api', path, body),
  fetchFile: (path) => ipcRenderer.invoke('fetch-file', path),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  exportCSV: () => ipcRenderer.invoke('export-csv'),
  exportPDF: (id) => ipcRenderer.invoke('export-pdf', id),
  exportReportPDF: (id) => ipcRenderer.invoke('export-report-pdf', id),
})