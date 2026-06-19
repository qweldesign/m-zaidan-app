const { contextBridge } = require('electron')

// 後でAPIアクセス用の関数をここに追加していく
contextBridge.exposeInMainWorld('electronAPI', {
  version: () => process.versions.electron,
})
