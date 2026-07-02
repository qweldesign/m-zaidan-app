// src/components/detail/Section5Panel.tsx

import { useEffect, useState } from 'react'
import { Section5 } from '../../types/submission'

type Props = {
  data: Section5
}

const DOC_LABELS: Record<string, string> = {
  regulations:     '規約・規則',
  activityReport:  '活動報告書',
  financialReport: '決算報告書',
  activityPlan:    '活動計画書',
  financialPlan:   '予算計画書',
}

type PhotoState =
  | { status: 'loading' }
  | { status: 'ok'; src: string }
  | { status: 'error' }

function PhotoItem({ filePath }: { filePath: string }) {
  const [state, setState] = useState<PhotoState>({ status: 'loading' })

  useEffect(() => {
    window.electronAPI.fetchFile(filePath)
      .then(({ base64, contentType }) => {
        setState({ status: 'ok', src: `data:${contentType};base64,${base64}` })
      })
      .catch(() => setState({ status: 'error' }))
  }, [filePath])

  if (state.status === 'loading') return (
    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
      読込中...
    </div>
  )

  if (state.status === 'error') return (
    <div className="w-24 h-24 bg-red-50 rounded flex items-center justify-center text-xs text-red-400 border border-red-200">
      取得失敗
    </div>
  )

  return (
    <img
      src={state.src}
      alt={filePath}
      className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80"
      onClick={() => window.electronAPI.openFile(filePath)}
    />
  )
}

type DocRowProps = {
  label: string
  filePath: string
}

function DocRow({ label, filePath }: DocRowProps) {
  const [error, setError] = useState(false)

  const handleOpen = async () => {
    try {
      await window.electronAPI.openFile(filePath)
    } catch {
      setError(true)
    }
  }

  return (
    <div className="flex items-center gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      {error
        ? <span className="text-red-400 text-xs">ファイルを開けませんでした</span>
        : (
          <button
            className="text-blue-600 hover:underline"
            onClick={handleOpen}
          >
            開く
          </button>
        )
      }
    </div>
  )
}

export default function Section5Panel({ data: d }: Props) {
  return (
    <div className="space-y-6">

      {/* 写真 */}
      {d.photos?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">写真</h2>
          <div className="flex flex-wrap gap-2">
            {d.photos.map(path => (
              <PhotoItem key={path} filePath={path} />
            ))}
          </div>
        </section>
      )}

      {/* 書類 */}
      {d.docs && Object.keys(d.docs).length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">添付書類</h2>
          <div className="space-y-1">
            {Object.entries(d.docs).map(([key, filePath]) =>
              filePath ? (
                <DocRow
                  key={key}
                  label={DOC_LABELS[key] ?? key}
                  filePath={filePath}
                />
              ) : null
            )}
          </div>
        </section>
      )}

    </div>
  )
}
