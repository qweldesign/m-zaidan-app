// src/hooks/useSubmissions.ts

import { useState, useEffect, useCallback } from 'react'
import { Submission } from '../types/submission'

type Params = {
  status?: string
  keyword?: string
  order_by?: string
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}

export function useSubmissions(params: Params = {}) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.status)   query.set('status', params.status)
      if (params.keyword)  query.set('keyword', params.keyword)
      if (params.order_by) query.set('order_by', params.order_by)
      if (params.order)    query.set('order', params.order)
      if (params.limit)    query.set('limit', String(params.limit))
      if (params.offset)   query.set('offset', String(params.offset))

      const res = await window.electronAPI.fetchAPI(`/api/submissions?${query}`)
      if (res.status !== 200) throw new Error(`API error: ${res.status}`)
      setSubmissions((res.data as any).data.items as Submission[])
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラー')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  return { submissions, loading, error, refetch: fetch }
}
