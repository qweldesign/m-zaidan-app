require('dotenv').config()

const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron')
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

// CSVを保存する
ipcMain.handle('export-csv', async () => {
  // 保存先をダイアログで選択
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'CSVを保存',
    defaultPath: `submissions_${new Date().toISOString().slice(0, 10)}.csv`,
    filters: [{ name: 'CSV', extensions: ['csv'] }],
  })

  if (canceled || !filePath) return { canceled: true }

  const res = await fetch(`${BASE_URL}/api/submissions/export/csv`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })

  const buffer = await res.arrayBuffer()
  fs.writeFileSync(filePath, Buffer.from(buffer))
  return { canceled: false, filePath }
})

// PDFを保存する
ipcMain.handle('export-pdf', async (_, submissionId) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'PDFを保存',
    defaultPath: `submission_${submissionId}_${new Date().toISOString().slice(0, 10)}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })

  if (canceled || !filePath) return { canceled: true }

  // 印刷用ウィンドウを作成
  const printWin = new BrowserWindow({
    width: 800,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  printWin.loadURL(`http://localhost:5173/print/${submissionId}`)

  await new Promise(resolve => {
    printWin.webContents.once('did-finish-load', resolve)
  })

  // 少し待ってからPDF化（データ取得完了を待つ）
  await new Promise(resolve => setTimeout(resolve, 1500))

  const pdfData = await printWin.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
  })

  fs.writeFileSync(filePath, pdfData)
  printWin.close()

  return { canceled: false, filePath }
})

// 完了報告PDFを保存する
ipcMain.handle('export-report-pdf', async (_, reportId) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'PDFを保存',
    defaultPath: `report_${reportId}_${new Date().toISOString().slice(0, 10)}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })

  if (canceled || !filePath) return { canceled: true }

  const printWin = new BrowserWindow({
    width: 800,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  printWin.loadURL(`http://localhost:5173/print-report/${reportId}`)

  await new Promise(resolve => {
    printWin.webContents.once('did-finish-load', resolve)
  })

  // 少し待ってからPDF化（データ取得完了を待つ）
  await new Promise(resolve => setTimeout(resolve, 1500))

  const pdfData = await printWin.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
  })

  fs.writeFileSync(filePath, pdfData)
  printWin.close()

  return { canceled: false, filePath }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
