// src/components/detail/SubmissionDetail.tsx

import { Submission } from '../../types/submission'

type Props = {
  submission: Submission
  onClose: () => void
}

const STATUS_COLOR: Record<string, string> = {
  '未審査': 'bg-gray-100 text-gray-700',
  '審査中': 'bg-blue-100 text-blue-700',
  '承認':   'bg-green-100 text-green-700',
  '否決':   'bg-red-100 text-red-700',
  '保留':   'bg-yellow-100 text-yellow-700',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-36 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function SubmissionDetail({ submission: s, onClose }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status] ?? ''}`}>
            {s.status}
          </span>
          <span className="text-sm font-bold">#{s.id}</span>
        </div>
        <button
          className="text-gray-400 hover:text-gray-700 text-lg leading-none"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* 本文 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

        {/* 団体情報 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">団体情報</h2>
          <Row label="団体名" value={s.team_name} />
          <Row label="フリガナ" value={s.team_name_kana} />
          <Row label="郵便番号" value={s.team_postal_code} />
          <Row label="所在地" value={s.team_address} />
          <Row label="設立年" value={s.established_year ? `${s.established_year}年` : null} />
          <Row label="活動区分" value={s.activity_category} />
        </section>

        {/* 代表者・担当者 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">代表者・担当者</h2>
          <Row label="代表者名" value={s.representative_name} />
          <Row label="代表者メール" value={s.representative_email} />
          <Row label="代表者電話" value={s.representative_phone} />
          <Row label="担当者名" value={s.contact_name} />
          <Row label="担当者メール" value={s.contact_email} />
          <Row label="担当者電話" value={s.contact_phone} />
        </section>

        {/* 事業情報 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業情報</h2>
          <Row label="事業名" value={s.project_name} />
          <Row label="開始日" value={s.start_date} />
          <Row label="終了日" value={s.end_date} />
          <Row label="開催場所" value={s.venue} />
        </section>

        {/* 金額 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">金額</h2>
          <Row label="助成金要望額" value={s.grant_request_amount != null ? `${s.grant_request_amount.toLocaleString()}円` : null} />
          <Row label="支出合計" value={s.total_expense_amount != null ? `${s.total_expense_amount.toLocaleString()}円` : null} />
          <Row label="助成金使用額" value={s.grant_usage_amount != null ? `${s.grant_usage_amount.toLocaleString()}円` : null} />
        </section>

        {/* 申請日時 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">申請情報</h2>
          <Row label="申請日時" value={s.created_at} />
          <Row label="更新日時" value={s.updated_at} />
        </section>

      </div>
    </div>
  )
}
