// src/components/detail/ReportSection1Panel.tsx

import { ReportSection1Data } from '../../types/report'

type Props = {
  data: ReportSection1Data
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function ReportSection1Panel({ data: d }: Props) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">団体情報</h2>
        <Row label="団体名" value={d.teamName} />
      </section>
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">担当者情報</h2>
        <Row label="担当者名" value={d.contactName} />
        <Row label="電話番号" value={d.contactPhone} />
        <Row label="メール" value={d.contactEmail} />
      </section>
    </div>
  )
}
