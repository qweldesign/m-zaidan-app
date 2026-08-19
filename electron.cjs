const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

// app.isPackaged の代わりに process.execPath で判定
const isPackaged = !process.execPath.includes('electron')

const envPath = isPackaged
  ? path.join(path.dirname(process.execPath), '.env')
  : path.join(__dirname, '.env')

require('dotenv').config({ path: envPath })

const TOKEN = process.env.API_TOKEN
const BASE_URL = process.env.API_BASE_URL

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

ipcMain.handle('fetch-api', async (_, apiPath, options = {}) => {
  const res = await fetch(`${BASE_URL}${apiPath}`, {
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

ipcMain.handle('patch-api', async (_, apiPath, body) => {
  const res = await fetch(`${BASE_URL}${apiPath}`, {
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

// 申請PDFをバッファとして生成する（保存ダイアログでの手動出力・通知メール添付の両方から使用）
async function generateSubmissionPdfBuffer(submissionId) {
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

  try {
    if (!app.isPackaged) {
      printWin.loadURL(`http://localhost:5173/#/print/${submissionId}`)
    } else {
      printWin.loadFile(path.join(__dirname, 'dist/index.html'), {
        hash: `/print/${submissionId}`
      })
    }

    await new Promise(resolve => {
      printWin.webContents.once('did-finish-load', resolve)
    })

    // 少し待ってからPDF化（データ取得完了を待つ）
    await new Promise(resolve => setTimeout(resolve, 1500))

    return await printWin.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
    })
  } finally {
    printWin.close()
  }
}

// PDFを保存する
ipcMain.handle('export-pdf', async (_, submissionId) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'PDFを保存',
    defaultPath: `submission_${submissionId}_${new Date().toISOString().slice(0, 10)}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })

  if (canceled || !filePath) return { canceled: true }

  const pdfData = await generateSubmissionPdfBuffer(submissionId)

  fs.writeFileSync(filePath, pdfData)

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

  if (!app.isPackaged) {
    printWin.loadURL(`http://localhost:5173/print-report/${reportId}`)
  } else {
    printWin.loadFile(path.join(__dirname, 'dist/index.html'), {
      hash: `/print-report/${reportId}`
    })
  }

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

ipcMain.handle('notify-submission', async (_, id, options = {}) => {
  const { attachPdf = false } = options

  // 審査中への通知メールには「PDF出力」と同じPDFを添付する
  let body
  if (attachPdf) {
    const pdfData = await generateSubmissionPdfBuffer(id)
    body = JSON.stringify({ pdf: pdfData.toString('base64') })
  }

  const res = await fetch(`${BASE_URL}/api/submissions/${id}/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    ...(body ? { body } : {}),
  })
  const data = await res.json()
  return { status: res.status, data }
})

ipcMain.handle('notify-report', async (_, id) => {
  const res = await fetch(`${BASE_URL}/api/reports/${id}/notify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const data = await res.json()
  return { status: res.status, data }
})

// 編集用リンク（トークン付き）をデフォルトブラウザで開く
ipcMain.handle('open-edit-link', async (_, kind, token) => {
  if (!token) return { opened: false }

  const path = kind === 'report' ? '/report' : '/application'
  await shell.openExternal(`${BASE_URL}${path}?token=${encodeURIComponent(token)}`)
  return { opened: true }
})

ipcMain.handle('show-confirm', async (_, message) => {
  const { response } = await dialog.showMessageBox({
    type: 'question',
    buttons: ['キャンセル', 'OK'],
    defaultId: 1,
    cancelId: 0,
    message,
  })
  return response === 1
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
