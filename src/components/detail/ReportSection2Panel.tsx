// src/components/detail/ReportSection2Panel.tsx

import { ReportSection2Data } from '../../types/report'

type Props = {
  data: ReportSection2Data
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900 whitespace-pre-wrap">{value ?? '―'}</span>
    </div>
  )
}

export default function ReportSection2Panel({ data: d }: Props) {
  const totalIncome = (Number(d.income?.grantRequest) || 0)
    + (Number(d.income?.memberFees) || 0)
    + (Number(d.income?.donations) || 0)
    + (Number(d.income?.tickets) || 0)
  const totalExpense = d.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0
  const totalGrantUsage = d.expenses?.reduce((sum, e) => sum + Number(e.grantUsage), 0) ?? 0

  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業情報</h2>
        <Row label="事業名" value={d.projectName} />
        <Row label="実施開始日" value={d.actualStartDate} />
        <Row label="実施終了日" value={d.actualEndDate} />
        <Row label="実施場所" value={d.actualVenue} />
        <Row label="運営人数" value={d.organizerCount != null ? `${d.organizerCount}人` : null} />
        <Row label="運営日数" value={d.organizerDays != null ? `${d.organizerDays}日` : null} />
        <Row label="参加人数" value={d.participantCount != null ? `${d.participantCount}人` : null} />
        <Row label="参加日数" value={d.participantDays != null ? `${d.participantDays}日` : null} />
        <Row label="実施内容" value={d.actualDetail} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">収入決算</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="px-3 py-2 border text-left">項目</th>
              <th className="px-3 py-2 border text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2 border">助成金</td>
              <td className="px-3 py-2 border text-right">{(Number(d.income?.grantRequest) || 0).toLocaleString()}円</td>
            </tr>
            <tr>
              <td className="px-3 py-2 border">会費</td>
              <td className="px-3 py-2 border text-right">{(Number(d.income?.memberFees) || 0).toLocaleString()}円</td>
            </tr>
            <tr>
              <td className="px-3 py-2 border">寄付金</td>
              <td className="px-3 py-2 border text-right">{(Number(d.income?.donations) || 0).toLocaleString()}円</td>
            </tr>
            <tr>
              <td className="px-3 py-2 border">チケット収入</td>
              <td className="px-3 py-2 border text-right">{(Number(d.income?.tickets) || 0).toLocaleString()}円</td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-3 py-2 border">収入合計</td>
              <td className="px-3 py-2 border text-right">{totalIncome.toLocaleString()}円</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">支出決算</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="px-3 py-2 border text-left">項目</th>
              <th className="px-3 py-2 border text-right">金額</th>
              <th className="px-3 py-2 border text-right">助成金使用額</th>
              <th className="px-3 py-2 border text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {d.expenses?.map(e => (
              <tr key={e.id}>
                <td className="px-3 py-2 border">{e.subject}</td>
                <td className="px-3 py-2 border text-right">{Number(e.amount).toLocaleString()}円</td>
                <td className="px-3 py-2 border text-right">{Number(e.grantUsage).toLocaleString()}円</td>
                <td className="px-3 py-2 border text-gray-500">{e.memo || '―'}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-medium">
              <td className="px-3 py-2 border">支出合計</td>
              <td className="px-3 py-2 border text-right">{totalExpense.toLocaleString()}円</td>
              <td className="px-3 py-2 border text-right">{totalGrantUsage.toLocaleString()}円</td>
              <td className="px-3 py-2 border" />
            </tr>
          </tbody>
        </table>
      </section>

      {d.budgetNote && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">備考</h2>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{d.budgetNote}</p>
        </section>
      )}

    </div>
  )
}
