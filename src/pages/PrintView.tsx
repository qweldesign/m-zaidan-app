// src/pages/PrintView.tsx

import { useParams } from 'react-router-dom'
import { useSubmission } from '../hooks/useSubmission'
import Section1Panel from '../components/detail/Section1Panel'
import Section2Panel from '../components/detail/Section2Panel'
import Section3Panel from '../components/detail/Section3Panel'
import Section4Panel from '../components/detail/Section4Panel'
import Section5Panel from '../components/detail/Section5Panel'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function PrintView() {
  const { id } = useParams()
  const { submission: s, loading } = useSubmission(id ? Number(id) : null)

  if (loading) return <p className="p-8">読み込み中...</p>
  if (!s) return <p className="p-8">データが見つかりません</p>

  return (
    <div className="p-8 space-y-8 text-sm">

      {/* タイトル */}
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold">助成金申請書</h1>
        <p className="text-gray-500 mt-1">申請ID: #{s.id}　申請日: {s.created_at.slice(0, 10)}</p>
      </div>

      {/* section1 */}
      {s.section1_json && Object.keys(s.section1_json).length > 0
        ? <Section1Panel data={s.section1_json} />
        : (
          <section>
            <Row label="団体名" value={s.team_name} />
            <Row label="代表者名" value={s.representative_name} />
          </section>
        )
      }

      {/* section2 */}
      {s.section2_json && Object.keys(s.section2_json).length > 0 && (
        <Section2Panel data={s.section2_json} />
      )}

      {/* section3 */}
      {s.section3_json && Object.keys(s.section3_json).length > 0 && (
        <Section3Panel data={s.section3_json} />
      )}

      {/* section4 */}
      {s.section4_json && Object.keys(s.section4_json).length > 0 && (
        <Section4Panel data={s.section4_json} />
      )}

      {/* section5は印刷では省略 */}

    </div>
  )
}
