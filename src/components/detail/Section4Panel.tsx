// src/components/detail/Section4Panel.tsx

import { Section4 } from '../../types/submission'

type Props = {
  data: Section4
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900 whitespace-pre-wrap">{value ?? '―'}</span>
    </div>
  )
}

export default function Section4Panel({ data: d }: Props) {
  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">設立・活動情報</h2>
        <Row
          label="設立目的"
          value={d.establishmentPurpose?.join('、')}
        />
        <Row label="設立経緯" value={d.establishmentBackground} />
        <Row label="活動頻度" value={d.activityFrequency} />
        <Row label="活動内容" value={d.activityContent} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">受賞歴</h2>
        <Row label="受賞の有無" value={d.hasAward} />
        {d.hasAward === 'あり' && (
          <Row label="受賞詳細" value={d.awardDetail} />
        )}
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">地域との関わり</h2>
        <Row label="地域関与の有無" value={d.hasCommunityInvolvement} />
        {d.hasCommunityInvolvement === 'あり' && (
          <Row label="関与の詳細" value={d.communityInvolvementDetail} />
        )}
      </section>

      {d.prNote && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">その他PR</h2>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{d.prNote}</p>
        </section>
      )}

    </div>
  )
}
