import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PrintView from './pages/PrintView'
import PrintReportView from './pages/PrintReportView'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('root要素が見つかりません')

createRoot(root).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/print/:id" element={<PrintView />} />
      <Route path="/print-report/:id" element={<PrintReportView />} />
    </Routes>
  </HashRouter>
)
