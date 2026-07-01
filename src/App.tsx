// src/App.tsx

import { useState } from 'react'
import { useSubmissions } from './hooks/useSubmissions'
import SubmissionTable from './components/SubmissionTable'
import Pagination from './components/Pagination'
import { Submission, SubmissionStatus } from './types/submission'

type SortKey = 'id' | 'team_name' | 'project_name' | 'status' | 'created_at' | 'grant_request_amount'
type SortOrder = 'ASC' | 'DESC'

const STATUSES: SubmissionStatus[] = ['未審査', '審査中', '承認', '否決', '保留']
const LIMIT = 40

export default function App() {
  const [status, setStatus] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')
  const [offset, setOffset] = useState(0)

  const { submissions, total, loading, error } = useSubmissions({
    status: status || undefined,
    keyword: keyword || undefined,
    order_by: sortKey,
    order: sortOrder,
    limit: LIMIT,
    offset,
  })

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      // 同じカラムをクリックしたら昇順・降順を切り替え
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortKey(key)
      setSortOrder('ASC')
    }
    setOffset(0) // ソート変更時は1ページ目に戻す
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setOffset(0) // フィルタ変更時も1ページ目に戻す
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setOffset(0)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white px-6 py-3 flex items-center gap-4">
        <h1 className="text-lg font-bold">助成金申請管理</h1>
      </header>

      {/* フィルタバー */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-white">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={status}
          onChange={e => handleStatusChange(e.target.value)}
        >
          <option value="">すべて</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 text-sm w-60"
          placeholder="団体名・事業名で検索"
          value={keyword}
          onChange={e => handleKeywordChange(e.target.value)}
        />
      </div>

      {/* メインエリア */}
      <main className="flex-1 overflow-auto px-6 py-4">
        {loading && <p className="text-gray-500">読み込み中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <SubmissionTable
              submissions={submissions}
              onSelect={setSelected}
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <Pagination
              total={total}
              limit={LIMIT}
              offset={offset}
              onPageChange={setOffset}
            />
          </>
        )}
      </main>
    </div>
  )
}
