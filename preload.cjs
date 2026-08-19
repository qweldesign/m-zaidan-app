const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  fetchAPI: (path, options) => ipcRenderer.invoke('fetch-api', path, options),
  patchAPI: (path, body) => ipcRenderer.invoke('patch-api', path, body),
  fetchFile: (path) => ipcRenderer.invoke('fetch-file', path),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  exportCSV: (kind, params) => ipcRenderer.invoke('export-csv', kind, params),
  exportPDF: (id) => ipcRenderer.invoke('export-pdf', id),
  exportReportPDF: (id) => ipcRenderer.invoke('export-report-pdf', id),
  notifySubmission: (id, options) => ipcRenderer.invoke('notify-submission', id, options),
  notifyReport: (id) => ipcRenderer.invoke('notify-report', id),
  showConfirm: (message) => ipcRenderer.invoke('show-confirm', message),
  openEditLink: (kind, token) => ipcRenderer.invoke('open-edit-link', kind, token),
})