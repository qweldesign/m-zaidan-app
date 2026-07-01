// src/components/detail/Section3Panel.tsx

import { Section3 } from '../../types/submission'

type Props = {
  data: Section3
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function Section3Panel({ data: d }: Props) {
  const totalExpense = d.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0
  const totalGrantUsage = d.expenses?.reduce((sum, e) => sum + Number(e.grantUsage), 0) ?? 0

  return (
    <div className="space-y-6">

      {/* 収入 */}
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">収入明細</h2>
        <Row label="助成金要望額" value={d.income?.grantRequest != null ? `${Number(d.income.grantRequest).toLocaleString()}円` : null} />
        <Row label="会費" value={d.income?.memberFees != null ? `${Number(d.income.memberFees).toLocaleString()}円` : null} />
        <Row label="寄付金" value={d.income?.donations != null ? `${Number(d.income.donations).toLocaleString()}円` : null} />
        <Row label="チケット収入" value={d.income?.tickets != null ? `${Number(d.income.tickets).toLocaleString()}円` : null} />
      </section>

      {/* 支出 */}
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">支出明細</h2>
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
              <td className="px-3 py-2 border">合計</td>
              <td className="px-3 py-2 border text-right">{totalExpense.toLocaleString()}円</td>
              <td className="px-3 py-2 border text-right">{totalGrantUsage.toLocaleString()}円</td>
              <td className="px-3 py-2 border" />
            </tr>
          </tbody>
        </table>
      </section>

      {/* 備考 */}
      {d.budgetNote && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">備考</h2>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{d.budgetNote}</p>
        </section>
      )}

    </div>
  )
}
