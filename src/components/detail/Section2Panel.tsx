// src/components/detail/Section2Panel.tsx

import { Section2 } from '../../types/submission'

type Props = {
  data: Section2
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900 whitespace-pre-wrap">{value ?? '―'}</span>
    </div>
  )
}

export default function Section2Panel({ data: d }: Props) {
  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業情報</h2>
        <Row label="事業名" value={d.projectName} />
        <Row label="開始日" value={d.startDate} />
        <Row label="終了日" value={d.endDate} />
        <Row label="開催場所" value={d.venue} />
        <Row label="募集対象地域" value={d.recruitmentArea} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">参加人数</h2>
        <Row label="運営人数" value={d.organizer?.count != null ? `${d.organizer.count}人` : null} />
        <Row label="運営日数" value={d.organizer?.days != null ? `${d.organizer.days}日` : null} />
        <Row label="参加人数" value={d.participants?.count != null ? `${d.participants.count}人` : null} />
        <Row label="参加日数" value={d.participants?.days != null ? `${d.participants.days}日` : null} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業詳細</h2>
        <Row label="事業内容" value={d.projectDetail} />
        <Row label="目的・ねらい" value={d.projectPurpose} />
        <Row label="特徴・PR" value={d.projectPR} />
      </section>

      {d.coOrganizers && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">共催情報</h2>
          <Row label="共催団体" value={d.coOrganizers} />
        </section>
      )}

    </div>
  )
}
