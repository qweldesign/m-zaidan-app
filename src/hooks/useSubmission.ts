// src/hooks/useSubmission.ts

import { useState, useEffect } from 'react'
import { Submission } from '../types/submission'

export function useSubmission(id: number | null) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) return
    setLoading(true)
    setError(null)
    window.electronAPI.fetchAPI(`/api/submissions/${id}`)
      .then(res => {
        if (res.status !== 200) throw new Error(`API error: ${res.status}`)
        setSubmission((res.data as any).data as Submission)
      })
      .catch(e => setError(e instanceof Error ? e.message : '不明なエラー'))
      .finally(() => setLoading(false))
  }, [id])

  return { submission, loading, error }
}
