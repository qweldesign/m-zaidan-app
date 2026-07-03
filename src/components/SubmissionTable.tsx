import { Submission } from '../types/submission'

type SortKey = 'id' | 'team_name' | 'project_name' | 'created_at' | 'activity_category' | 'status' | 'grant_request_amount'
type SortOrder = 'ASC' | 'DESC'

type Props = {
  submissions: Submission[]
  onSelect: (submission: Submission) => void
  sortKey: SortKey
  sortOrder: SortOrder
  onSort: (key: SortKey) => void
}

const STATUS_COLOR: Record<string, string> = {
  '審査中': 'bg-blue-100 text-blue-700',
  '承認':   'bg-green-100 text-green-700',
  '否決':   'bg-red-100 text-red-700',
  '対象外': 'bg-gray-100 text-gray-700',
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'id',                  label: 'ID' },
  { key: 'team_name',           label: '団体名' },
  { key: 'project_name',        label: '事業名' },
  { key: 'created_at',          label: '申請日' },
  { key: 'activity_category',    label: 'カテゴリ' },
  { key: 'status',              label: 'ステータス' },
  { key: 'grant_request_amount', label: '要望額' },
]

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1">{order === 'ASC' ? '↑' : '↓'}</span>
}

export default function SubmissionTable({ submissions, onSelect, sortKey, sortOrder, onSort }: Props) {
  return (
    <table className="w-full min-w-160 text-sm border-collapse">
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
        {submissions.map(s => (
          <tr
            key={s.id}
            className="hover:bg-blue-50 cursor-pointer border-b"
            onClick={() => onSelect(s)}
          >
            <td className="px-4 py-2">{s.id}</td>
            <td className="px-4 py-2">{s.team_name}</td>
            <td className="px-4 py-2">{s.project_name}</td>
            <td className="px-4 py-2">{s.created_at.slice(0, 10)}</td>
            <td className="px-4 py-2">{s.activity_category}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status] ?? ''}`}>
                {s.status}
              </span>
            </td>
            <td className="px-4 py-2 text-right">
              {s.grant_request_amount.toLocaleString()}円
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
