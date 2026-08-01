// src/hooks/useSubmissions.ts

import { useState, useEffect, useCallback } from 'react'
import { Submission } from '../types/submission'

type Params = {
  status?: string
  keyword?: string
  activity_category?: string
  year?: string
  include_deleted?: boolean
  order_by?: string
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}

export function useSubmissions(params: Params = {}) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.status)   query.set('status', params.status)
      if (params.keyword)  query.set('keyword', params.keyword)
      if (params.activity_category) query.set('activity_category', params.activity_category)
      if (params.year)     query.set('year', params.year)
      if (params.include_deleted) query.set('include_deleted', '1')
      if (params.order_by) query.set('order_by', params.order_by)
      if (params.order)    query.set('order', params.order)
      if (params.limit)    query.set('limit', String(params.limit))
      if (params.offset)   query.set('offset', String(params.offset))

      const res = await window.electronAPI.fetchAPI(`/api/submissions?${query}`)
      if (res.status !== 200) throw new Error(`API error: ${res.status}`)
      setSubmissions((res.data as any).data.items as Submission[])
      setTotal((res.data as any).data.total as number)
    } catch (e) {
      if (e instanceof TypeError && e.message.includes('fetch')) {
        setError('サーバーに接続できません。ネットワークを確認してください。')
      } else {
        setError(e instanceof Error ? e.message : '不明なエラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  return { submissions, total, loading, error, refetch: fetch }
}
