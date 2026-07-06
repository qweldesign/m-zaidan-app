// src/components/details/ReportDetail.tsx

import { useState } from 'react'
import { Report, ReportStatus } from '../../types/report'
import ReportSection1Panel from './ReportSection1Panel'
import ReportSection2Panel from './ReportSection2Panel'

type Props = {
  report: Report
  onClose: () => void
  onUpdated: () => void
}

const STATUSES: ReportStatus[] = ['確認前', '確認済', '要修正']

const STATUS_COLOR: Record<ReportStatus, string> = {
  '確認前': 'bg-gray-100 text-gray-700',
  '確認済': 'bg-green-100 text-green-700',
  '要修正': 'bg-red-100 text-red-700',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function ReportDetail({ report: r, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<ReportStatus>(r.status)
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (newStatus: ReportStatus) => {
    setStatus(newStatus)
    setSaving(true)
    try {
      const res = await window.electronAPI.patchAPI(`/api/reports/${r.id}`, { status: newStatus })
      if (res.status !== 200) throw new Error(`API error: ${res.status}`)
      onUpdated()
    } catch {
      alert('ステータスの更新に失敗しました')
      setStatus(r.status)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <select
            className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLOR[status] ?? ''}`}
            value={status}
            disabled={saving}
            onChange={e => handleStatusChange(e.target.value as ReportStatus)}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {saving && <span className="text-xs text-gray-400">保存中...</span>}
          <span className="text-sm font-bold">#{r.id}</span>
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

        {r.report_section1_json && Object.keys(r.report_section1_json).length > 0
          ? <ReportSection1Panel data={r.report_section1_json} />
          : (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">団体情報</h2>
              <Row label="団体名" value={r.team_name} />
              <Row label="担当者名" value={r.contact_name} />
              <Row label="担当者メール" value={r.contact_email} />
              <Row label="担当者電話" value={r.contact_phone} />
            </section>
          )
        }

        {r.report_section2_json && Object.keys(r.report_section2_json).length > 0
          ? <ReportSection2Panel data={r.report_section2_json} />
          : (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業情報</h2>
              <Row label="事業名" value={r.project_name} />
              <Row label="実施開始日" value={r.actual_start_date} />
              <Row label="実施終了日" value={r.actual_end_date} />
              <Row label="実施場所" value={r.actual_venue} />
            </section>
          )
        }

        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">金額</h2>
          <Row label="助成金要望額" value={r.grant_request_amount != null ? `${r.grant_request_amount.toLocaleString()}円` : null} />
          <Row label="支出合計" value={r.total_expense_amount != null ? `${r.total_expense_amount.toLocaleString()}円` : null} />
          <Row label="助成金使用額" value={r.grant_usage_amount != null ? `${r.grant_usage_amount.toLocaleString()}円` : null} />
        </section>

        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">報告情報</h2>
          <Row label="報告日時" value={r.created_at} />
          <Row label="更新日時" value={r.updated_at} />
        </section>

      </div>
    </div>
  )
}
