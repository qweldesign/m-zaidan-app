require('dotenv').config()

const { app, BrowserWindow, ipcMain, shell } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

const TOKEN = process.env.API_TOKEN
const BASE_URL = process.env.API_BASE_URL

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL('http://localhost:5173')
  win.webContents.openDevTools()
}

ipcMain.handle('fetch-api', async (_, path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers ?? {}),
    },
  })
  const data = await res.json()
  return { status: res.status, data }
})

ipcMain.handle('patch-api', async (_, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { status: res.status, data }
})

// 画像をbase64で返す
ipcMain.handle('fetch-file', async (_, filePath) => {
  const res = await fetch(`${BASE_URL}/api/files?path=${encodeURIComponent(filePath)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
  return { base64, contentType }
})

// PDFを一時ファイルに保存して外部ビューアで開く
ipcMain.handle('open-file', async (_, filePath) => {
  const res = await fetch(`${BASE_URL}/api/files?path=${encodeURIComponent(filePath)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const buffer = await res.arrayBuffer()
  const ext = filePath.split('.').pop() ?? 'bin'
  const tmpPath = path.join(os.tmpdir(), `zaidan_${Date.now()}.${ext}`)
  fs.writeFileSync(tmpPath, Buffer.from(buffer))
  await shell.openPath(tmpPath)
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
