// src/components/detail/Section1Panel.tsx

import { Section1 } from '../../types/submission'

type Props = {
  data: Section1
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function Section1Panel({ data: d }: Props) {
  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">団体情報</h2>
        <Row label="団体名" value={d.teamName} />
        <Row label="フリガナ" value={d.teamNameKana} />
        <Row label="郵便番号" value={d.teamPostalCode} />
        <Row label="所在地" value={d.teamAddress} />
        <Row label="設立年" value={d.establishedYear ? `${d.establishedYear}年` : null} />
        <Row label="活動区分" value={d.activityCategory} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">会員構成</h2>
        <Row label="20歳以下" value={d.members?.under20 != null ? `${d.members.under20}人` : null} />
        <Row label="21〜40歳" value={d.members?.age21to40 != null ? `${d.members.age21to40}人` : null} />
        <Row label="41〜60歳" value={d.members?.age41to60 != null ? `${d.members.age41to60}人` : null} />
        <Row label="61歳以上" value={d.members?.over61 != null ? `${d.members.over61}人` : null} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">助成・応募歴</h2>
        <Row label="当財団助成回数" value={d.grantHistory?.thisFoundationCount != null ? `${d.grantHistory.thisFoundationCount}回` : null} />
        <Row label="当財団最終年度" value={d.grantHistory?.thisFoundationLatestYear} />
        <Row label="他財団助成回数" value={d.grantHistory?.otherFoundationCount != null ? `${d.grantHistory.otherFoundationCount}回` : null} />
        <Row label="他財団最終年度" value={d.grantHistory?.otherFoundationLatestYear} />
        <Row label="応募回数" value={d.applicationHistory?.count != null ? `${d.applicationHistory.count}回` : null} />
        <Row label="応募最終年度" value={d.applicationHistory?.latestYear} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">代表者情報</h2>
        <Row label="代表者名" value={d.representativeName} />
        <Row label="フリガナ" value={d.representativeNameKana} />
        <Row label="電話番号" value={d.representativePhone} />
        <Row label="メール" value={d.representativeEmail} />
        <Row label="担当者兼務" value={d.sameAsRepresentative ? 'はい' : 'いいえ'} />
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">応募経路</h2>
        <Row label="応募経路" value={d.applicationRoute?.join('、')} />
        {d.applicationRouteOther && (
          <Row label="その他" value={d.applicationRouteOther} />
        )}
      </section>

    </div>
  )
}
