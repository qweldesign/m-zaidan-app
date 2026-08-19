// src/App.tsx

import { useState } from 'react'
import { useSubmissions } from './hooks/useSubmissions'
import { useSubmission } from './hooks/useSubmission'
import { useReports } from './hooks/useReports'
import { useReport } from './hooks/useReport'
import SubmissionTable from './components/SubmissionTable'
import ReportTable from './components/ReportTable'
import Pagination from './components/Pagination'
import SubmissionDetail from './components/detail/SubmissionDetail'
import ReportDetail from './components/detail/ReportDetail'
import ErrorMessage from './components/ErrorMessage'
import { Submission, SubmissionStatus, ActivityCategory } from './types/submission'
import { Report } from './types/report'

type Tab = 'submissions' | 'reports'
type SubmissionSortKey = 'id' | 'team_name' | 'project_name' | 'activity_category' | 'status' | 'created_at' | 'grant_request_amount'
type ReportSortKey = 'id' | 'team_name' | 'project_name' | 'activity_category' | 'actual_start_date' | 'status' | 'grant_request_amount' | 'created_at'
type SortOrder = 'ASC' | 'DESC'

const STATUSES: SubmissionStatus[] = ['審査前', '審査中', '承認', '否決', '対象外']
const CATEGORIES: ActivityCategory[] = ['ボランティア活動', 'スポーツ活動', 'その他市民活動']
const currentYear = new Date().getFullYear()
const YEARS: string[] = Array.from(
  { length: currentYear - 2025 + 1 },
  (_, i) => String(2025 + i)
)
const LIMIT = 50

export default function App() {
  const [tab, setTab] = useState<Tab>('submissions')

  // 申請一覧
  const [status, setStatus] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [year, setYear] = useState<string>(String(currentYear))
  const [includeDeleted, setIncludeDeleted] = useState(false)
const [reportIncludeDeleted, setReportIncludeDeleted] = useState(false)
  const [sortKey, setSortKey] = useState<SubmissionSortKey>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('ASC')
  const [offset, setOffset] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { submission: selected, loading: detailLoading } = useSubmission(selectedId)

  // 完了報告一覧
  const [reportKeyword, setReportKeyword] = useState<string>('')
  const [reportCategory, setReportCategory] = useState<string>('')
  const [reportYear, setReportYear] = useState<string>(String(currentYear))
  const [reportSortKey, setReportSortKey] = useState<ReportSortKey>('id')
  const [reportSortOrder, setReportSortOrder] = useState<SortOrder>('ASC')
  const [reportOffset, setReportOffset] = useState(0)
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const { report: selectedReport, loading: reportDetailLoading } = useReport(selectedReportId)

  const { submissions, total, loading, error, refetch } = useSubmissions({
    status: status || undefined,
    keyword: keyword || undefined,
    activity_category: category || undefined,
    year: year || undefined,
    include_deleted: includeDeleted,
    order_by: sortKey,
    order: sortOrder,
    limit: LIMIT,
    offset,
  })

  const { reports, total: reportTotal, loading: reportLoading, error: reportError, refetch: reportRefetch } = useReports({
    keyword: reportKeyword || undefined,
    activity_category: reportCategory || undefined,
    year: reportYear || undefined,
    include_deleted: reportIncludeDeleted,
    order_by: reportSortKey,
    order: reportSortOrder,
    limit: LIMIT,
    offset: reportOffset,
  })

  const handleSort = (key: SubmissionSortKey) => {
    if (key === sortKey) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortKey(key)
      setSortOrder('ASC')
    }
    setOffset(0)
  }

  const handleReportSort = (key: ReportSortKey) => {
    if (key === reportSortKey) {
      setReportSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setReportSortKey(key)
      setReportSortOrder('ASC')
    }
    setReportOffset(0)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white px-6 py-3 flex items-center gap-4">
        <h1 className="text-lg font-bold">助成金申請管理</h1>
        <div className="ml-auto flex gap-2">
          <button
            className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-50"
            onClick={async () => {
              // 現在そのタブの一覧に適用されているフィルター・並び順のままCSV出力する
              const exportParams = tab === 'reports'
                ? {
                    keyword: reportKeyword || undefined,
                    activity_category: reportCategory || undefined,
                    year: reportYear || undefined,
                    include_deleted: reportIncludeDeleted,
                    order_by: reportSortKey,
                    order: reportSortOrder,
                  }
                : {
                    status: status || undefined,
                    keyword: keyword || undefined,
                    activity_category: category || undefined,
                    year: year || undefined,
                    include_deleted: includeDeleted,
                    order_by: sortKey,
                    order: sortOrder,
                  }
              const result = await window.electronAPI.exportCSV(tab, exportParams)
              if (!result.canceled) alert(`保存しました:\n${result.filePath}`)
            }}
          >
            {tab === 'reports' ? '完了報告CSV出力' : '要望申請CSV出力'}
          </button>
        </div>
      </header>

      {/* タブ */}
      <div className="flex border-b bg-white px-6">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'submissions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('submissions')}
        >
          要望申請一覧
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('reports')}
        >
          完了報告一覧
        </button>
      </div>

      {/* 申請一覧タブ */}
      {tab === 'submissions' && (
        <>
          <div className="flex items-center gap-3 px-6 py-3 border-b bg-white">
            <select className="border rounded px-2 py-1 text-sm" value={year} onChange={e => { setYear(e.target.value); setOffset(0) }}>
              <option value="">すべての年</option>
              {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select className="border rounded px-2 py-1 text-sm" value={category} onChange={e => { setCategory(e.target.value); setOffset(0) }}>
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded px-2 py-1 text-sm" value={status} onChange={e => { setStatus(e.target.value); setOffset(0) }}>
              <option value="">すべてのステータス</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              className={`text-sm px-3 py-1 rounded border ${includeDeleted ? 'bg-red-50 text-red-600 border-red-300' : 'text-gray-500 border-gray-300'}`}
              onClick={() => { setIncludeDeleted(prev => !prev); setOffset(0) }}
            >
              {includeDeleted ? '削除済みを含む' : '削除済みを含まない'}
            </button>
            <input
              className="border rounded px-2 py-1 text-sm w-60"
              placeholder="団体名・事業名で検索"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setOffset(0) }}
            />
          </div>
          <main className="flex-1 overflow-hidden relative">
            <div className="flex flex-col h-full overflow-auto px-6 py-4">
              {loading && <p className="text-gray-500 py-8 text-center">読み込み中...</p>}
              {error && <ErrorMessage message={error} onRetry={refetch} />}
              {!loading && !error && (
                <>
                  <SubmissionTable
                    submissions={submissions}
                    onSelect={s => setSelectedId(s.id)}
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <Pagination total={total} limit={LIMIT} offset={offset} onPageChange={setOffset} />
                </>
              )}
            </div>
            {selectedId && (
              <div className="absolute top-0 right-0 h-full w-1/2 border-l shadow-xl overflow-y-auto bg-white">
                {detailLoading && <p className="p-6 text-gray-500">読み込み中...</p>}
                {selected && (
                  <SubmissionDetail
                    submission={selected}
                    onClose={() => setSelectedId(null)}
                    onUpdated={refetch}
                  />
                )}
              </div>
            )}
          </main>
        </>
      )}

      {/* 完了報告タブ */}
      {tab === 'reports' && (
        <>
          <div className="flex items-center gap-3 px-6 py-3 border-b bg-white">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={reportYear}
              onChange={e => { setReportYear(e.target.value); setReportOffset(0) }}
            >
              <option value="">すべての年</option>
              {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={reportCategory}
              onChange={e => { setReportCategory(e.target.value); setReportOffset(0) }}
            >
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              className={`text-sm px-3 py-1 rounded border ${reportIncludeDeleted ? 'bg-red-50 text-red-600 border-red-300' : 'text-gray-500 border-gray-300'}`}
              onClick={() => { setReportIncludeDeleted(prev => !prev); setReportOffset(0) }}
            >
              {reportIncludeDeleted ? '削除済みを含む' : '削除済みを含まない'}
            </button>
            <input
              className="border rounded px-2 py-1 text-sm w-60"
              placeholder="団体名・事業名で検索"
              value={reportKeyword}
              onChange={e => { setReportKeyword(e.target.value); setReportOffset(0) }}
            />
          </div>
          <main className="flex-1 overflow-hidden relative">
            <div className="flex flex-col h-full overflow-auto px-6 py-4">
              {reportLoading && <p className="text-gray-500 py-8 text-center">読み込み中...</p>}
              {reportError && <ErrorMessage message={reportError} onRetry={reportRefetch} />}
              {!reportLoading && !reportError && (
                <>
                  <ReportTable
                    reports={reports}
                    onSelect={r => setSelectedReportId(r.id)}
                    sortKey={reportSortKey}
                    sortOrder={reportSortOrder}
                    onSort={handleReportSort}
                  />
                  <Pagination total={reportTotal} limit={LIMIT} offset={reportOffset} onPageChange={setReportOffset} />
                </>
              )}
            </div>
            {selectedReportId && (
              <div className="absolute top-0 right-0 h-full w-1/2 border-l shadow-xl overflow-y-auto bg-white">
                {reportDetailLoading && <p className="p-6 text-gray-500">読み込み中...</p>}
                {selectedReport && (
                  <ReportDetail
                    report={selectedReport}
                    onClose={() => setSelectedReportId(null)}
                    onUpdated={reportRefetch}
                  />
                )}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  )
}
