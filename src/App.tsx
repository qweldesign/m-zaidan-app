// src/App.tsx

import { useState } from 'react'
import { useSubmissions } from './hooks/useSubmissions'
import SubmissionTable from './components/SubmissionTable'
import { Submission, SubmissionStatus } from './types/submission'

const STATUSES: SubmissionStatus[] = ['未審査', '審査中', '承認', '否決', '保留']

export default function App() {
  const [status, setStatus] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [selected, setSelected] = useState<Submission | null>(null)

  const { submissions, loading, error } = useSubmissions({
    status: status || undefined,
    keyword: keyword || undefined,
    limit: 50,
  })

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
          onChange={e => setStatus(e.target.value)}
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
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      {/* メインエリア */}
      <main className="flex-1 overflow-auto px-6 py-4">
        {loading && <p className="text-gray-500">読み込み中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <SubmissionTable
            submissions={submissions}
            onSelect={setSelected}
          />
        )}
      </main>
    </div>
  )
}
