// src/components/detail/Section3Panel.tsx

import { Section3 } from '../../types/submission'

type Props = {
  data: Section3
}

export default function Section3Panel({ data: d }: Props) {
  const totalIncome = (Number(d.income?.grantRequest) || 0)
    + (Number(d.income?.memberFees) || 0)
    + (Number(d.income?.donations) || 0)
    + (Number(d.income?.tickets) || 0)
  const totalExpense = d.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0
  const totalGrantUsage = d.expenses?.reduce((sum, e) => sum + Number(e.grantUsage), 0) ?? 0

  return (
    <div className="space-y-6">

      {/* 収入 */}
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">収入明細</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="px-3 py-2 border text-left">項目</th>
              <th className="px-3 py-2 border text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2 border">助成金要望額</td>
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
              <td className="px-3 py-2 border">支出合計</td>
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
