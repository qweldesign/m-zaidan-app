require('dotenv').config()

const { app, BrowserWindow, ipcMain } = require('electron')
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

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
