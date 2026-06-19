// src/components/SubmissionTable.tsx

import { Submission } from '../types/submission'

type Props = {
  submissions: Submission[]
  onSelect: (submission: Submission) => void
}

const STATUS_COLOR: Record<string, string> = {
  '未審査': 'bg-gray-100 text-gray-700',
  '審査中': 'bg-blue-100 text-blue-700',
  '承認':   'bg-green-100 text-green-700',
  '否決':   'bg-red-100 text-red-700',
  '保留':   'bg-yellow-100 text-yellow-700',
}

export default function SubmissionTable({ submissions, onSelect }: Props) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
          <th className="px-4 py-2 border-b">ID</th>
          <th className="px-4 py-2 border-b">団体名</th>
          <th className="px-4 py-2 border-b">事業名</th>
          <th className="px-4 py-2 border-b">ステータス</th>
          <th className="px-4 py-2 border-b">申請日</th>
          <th className="px-4 py-2 border-b">要望額</th>
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
            <td className="px-4 py-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status] ?? ''}`}>
                {s.status}
              </span>
            </td>
            <td className="px-4 py-2">{s.created_at.slice(0, 10)}</td>
            <td className="px-4 py-2 text-right">
              {s.grant_request_amount.toLocaleString()}円
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
