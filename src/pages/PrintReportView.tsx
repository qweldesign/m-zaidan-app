// src/pages/PrintReportView.tsx

import { useParams } from 'react-router-dom'
import { useReport } from '../hooks/useReport'
import ReportSection1Panel from '../components/detail/ReportSection1Panel'
import ReportSection2Panel from '../components/detail/ReportSection2Panel'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function PrintReportView() {
  const { id } = useParams()
  const { report: r, loading } = useReport(id ? Number(id) : null)

  if (loading) return <p className="p-8">読み込み中...</p>
  if (!r) return <p className="p-8">データが見つかりません</p>

  return (
    <div className="p-8 space-y-8 text-sm">

      <div className="border-b pb-4">
        <h1 className="text-xl font-bold">完了報告書</h1>
        <p className="text-gray-500 mt-1">報告ID: #{r.id}　報告日: {r.created_at.slice(0, 10)}</p>
      </div>

      {r.report_section1_json && Object.keys(r.report_section1_json).length > 0
        ? <ReportSection1Panel data={r.report_section1_json} />
        : (
          <section>
            <Row label="団体名" value={r.team_name} />
            <Row label="担当者名" value={r.contact_name} />
            <Row label="担当者メール" value={r.contact_email} />
            <Row label="担当者電話" value={r.contact_phone} />
          </section>
        )
      }

      {r.report_section2_json && Object.keys(r.report_section2_json).length > 0 && (
        <ReportSection2Panel data={r.report_section2_json} />
      )}

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">金額</h2>
        <Row label="助成金要望額" value={r.grant_request_amount != null ? `${r.grant_request_amount.toLocaleString()}円` : null} />
        <Row label="支出合計" value={r.total_expense_amount != null ? `${r.total_expense_amount.toLocaleString()}円` : null} />
        <Row label="助成金使用額" value={r.grant_usage_amount != null ? `${r.grant_usage_amount.toLocaleString()}円` : null} />
      </section>

    </div>
  )
}
