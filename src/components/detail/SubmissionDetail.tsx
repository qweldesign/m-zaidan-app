// src/components/detail/SubmissionDetail.tsx

import { useState, useEffect } from 'react'
import { Submission, SubmissionStatus } from '../../types/submission'
import Section1Panel from './Section1Panel'
import Section2Panel from './Section2Panel'
import Section3Panel from './Section3Panel'
import Section4Panel from './Section4Panel'
import Section5Panel from './Section5Panel'

type Props = {
  submission: Submission
  onClose: () => void
  onUpdated: () => void
}

const STATUSES: SubmissionStatus[] = ['審査前', '審査中', '承認', '否決', '対象外']

const STATUS_COLOR: Record<string, string> = {
  '審査前': 'bg-gray-100 text-gray-700',
  '審査中': 'bg-blue-100 text-blue-700',
  '承認':   'bg-green-100 text-green-700',
  '否決':   'bg-red-100 text-red-700',
  '対象外': 'bg-gray-100 text-gray-700',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-36 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value ?? '―'}</span>
    </div>
  )
}

export default function SubmissionDetail({ submission: s, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<SubmissionStatus>(s.status)
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    setStatus(newStatus)
    setSaving(true)
    try {
      const res = await window.electronAPI.patchAPI(`/api/submissions/${s.id}`, { status: newStatus })
      if (res.status !== 200) throw new Error(`API error: ${res.status}`)
      onUpdated()
    } catch (e) {
      alert('ステータスの更新に失敗しました')
      setStatus(s.status) // 元に戻す
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    const result = await window.electronAPI.exportPDF(s.id)
    if (!result.canceled) {
      alert(`保存しました:\n${result.filePath}`)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この申請を削除しますか？')) return
    try {
      const res = await window.electronAPI.patchAPI(`/api/submissions/${s.id}`, { is_deleted: 1 })
      if (res.status !== 200) throw new Error()
      onUpdated()
      onClose()
    } catch {
      alert('削除に失敗しました')
    }
  }

  const handleRestore = async () => {
    if (!confirm('この申請を復元しますか？')) return
    try {
      const res = await window.electronAPI.patchAPI(`/api/submissions/${s.id}`, { is_deleted: 0 })
      if (res.status !== 200) throw new Error()
      onUpdated()
    } catch {
      alert('復元に失敗しました')
    }
  }

  useEffect(() => {
    setStatus(s.status)
  }, [s.id])

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <select
            className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLOR[status] ?? ''}`}
            value={status}
            disabled={saving}
            onChange={e => handleStatusChange(e.target.value as SubmissionStatus)}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {saving && <span className="text-xs text-gray-400">保存中...</span>}
          <span className="text-sm font-bold">#{s.id}</span>
        </div>
        <div>
          <button
            className="text-xs text-gray-500 hover:text-gray-700 mr-4 px-2 py-1 border rounded"
            onClick={handleExportPDF}
          >
            PDF出力
          </button>
          {s.is_deleted === 1
            ? (
              <button
                className="text-xs text-green-600 hover:text-green-800 mr-4 px-2 py-1 border border-green-300 rounded"
                onClick={handleRestore}
              >
                復元
              </button>
            ) : (
              <button
                className="text-xs text-red-400 hover:text-red-600 mr-4 px-2 py-1 border border-red-200 rounded"
                onClick={handleDelete}
              >
                削除
              </button>
            )
          }
          <button
            className="text-gray-400 hover:text-gray-700 text-lg leading-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* 本文 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

        {/* 団体情報 */}
        {s.section1_json && Object.keys(s.section1_json).length > 0
          ? <Section1Panel data={s.section1_json} />
          : (
            <>
              {/* 団体情報 */}
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">団体情報</h2>
                <Row label="団体名" value={s.team_name} />
                <Row label="フリガナ" value={s.team_name_kana} />
                <Row label="郵便番号" value={s.team_postal_code} />
                <Row label="所在地" value={s.team_address} />
                <Row label="設立年" value={s.established_year ? `${s.established_year}年` : null} />
                <Row label="活動区分" value={s.activity_category} />
              </section>

              {/* 代表者・担当者 */}
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">代表者・担当者</h2>
                <Row label="代表者名" value={s.representative_name} />
                <Row label="代表者メール" value={s.representative_email} />
                <Row label="代表者電話" value={s.representative_phone} />
                <Row label="担当者名" value={s.contact_name} />
                <Row label="担当者メール" value={s.contact_email} />
                <Row label="担当者電話" value={s.contact_phone} />
              </section>
            </>
          )
        }

        {/* 事業情報 */}
        {s.section2_json && Object.keys(s.section2_json).length > 0
          ? <Section2Panel data={s.section2_json} />
          : (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">事業情報</h2>
              <Row label="事業名" value={s.project_name} />
              <Row label="開始日" value={s.start_date} />
              <Row label="終了日" value={s.end_date} />
              <Row label="開催場所" value={s.venue} />
            </section>
          )
        }

        {/* 金額 */}
        {s.section3_json && Object.keys(s.section3_json).length > 0
          ? <Section3Panel data={s.section3_json} />
          : (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">金額</h2>
              <Row label="助成金要望額" value={s.grant_request_amount != null ? `${s.grant_request_amount.toLocaleString()}円` : null} />
              <Row label="支出合計" value={s.total_expense_amount != null ? `${s.total_expense_amount.toLocaleString()}円` : null} />
              <Row label="助成金使用額" value={s.grant_usage_amount != null ? `${s.grant_usage_amount.toLocaleString()}円` : null} />
            </section>
          )
        }

        {/* 団体詳細 */}
        {s.section4_json && Object.keys(s.section4_json).length > 0
          ? <Section4Panel data={s.section4_json} />
          : null
        }

        {/* 添付ファイル */}
        {s.section5_json && Object.keys(s.section5_json).length > 0 && (
          <Section5Panel data={s.section5_json} />
        )}

        {/* 申請日時 */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">申請情報</h2>
          <Row label="申請日時" value={s.created_at} />
          <Row label="更新日時" value={s.updated_at} />
        </section>

      </div>
    </div>
  )
}
