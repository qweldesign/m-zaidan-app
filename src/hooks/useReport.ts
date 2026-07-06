// src/hooks/useReport.ts

import { useState, useEffect } from 'react'
import { Report } from '../types/report'

export function useReport(id: number | null) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) {
      setReport(null)
      return
    }
    setLoading(true)
    setError(null)
    window.electronAPI.fetchAPI(`/api/reports/${id}`)
      .then(res => {
        if (res.status !== 200) throw new Error(`API error: ${res.status}`)
        setReport((res.data as any).data as Report)
      })
      .catch(e => setError(e instanceof Error ? e.message : '不明なエラー'))
      .finally(() => setLoading(false))
  }, [id])

  return { report, loading, error }
}
