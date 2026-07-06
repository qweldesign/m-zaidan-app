// src/components/ReportTable.tsx

import { Report, ReportStatus } from '../types/report'

type SortKey = 'id' | 'team_name' | 'project_name' | 'actual_start_date' | 'activity_category' | 'status' | 'grant_request_amount' | 'created_at'
type SortOrder = 'ASC' | 'DESC'

type Props = {
  reports: Report[]
  onSelect: (report: Report) => void
  sortKey: SortKey
  sortOrder: SortOrder
  onSort: (key: SortKey) => void
}

const STATUS_COLOR: Record<ReportStatus, string> = {
  '確認前': 'bg-gray-100 text-gray-700',
  '確認済': 'bg-green-100 text-green-700',
  '要修正': 'bg-red-100 text-red-700',
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'id',                   label: 'ID' },
  { key: 'team_name',            label: '団体名' },
  { key: 'project_name',         label: '事業名' },
  { key: 'actual_start_date',    label: '実施日' },
  { key: 'activity_category',    label: 'カテゴリ' },
  { key: 'status',               label: 'ステータス' },
  { key: 'grant_request_amount', label: '要望額' },
  { key: 'created_at',           label: '報告日' },
]

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1">{order === 'ASC' ? '↑' : '↓'}</span>
}

export default function ReportTable({ reports, onSelect, sortKey, sortOrder, onSort }: Props) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
          {COLUMNS.map(col => (
            <th
              key={col.key}
              className="px-4 py-2 border-b cursor-pointer select-none hover:bg-gray-100"
              onClick={() => onSort(col.key)}
            >
              {col.label}
              <SortIcon active={sortKey === col.key} order={sortOrder} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reports.map(r => (
          <tr
            key={r.id}
            className="hover:bg-blue-50 cursor-pointer border-b"
            onClick={() => onSelect(r)}
          >
            <td className="px-4 py-2">{r.id}</td>
            <td className="px-4 py-2">{r.team_name}</td>
            <td className="px-4 py-2">{r.project_name}</td>
            <td className="px-4 py-2">{r.actual_start_date}</td>
            <td className="px-4 py-2">{r.activity_category}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status] ?? ''}`}>
                {r.status}
              </span>
            </td>
            <td className="px-4 py-2 text-right">
              {r.grant_request_amount?.toLocaleString()}円
            </td>
            <td className="px-4 py-2">{r.created_at?.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
