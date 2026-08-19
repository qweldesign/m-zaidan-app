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
    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
      読込中...
    </div>
  )

  if (state.status === 'error') return (
    <div className="w-48 h-48 bg-red-50 rounded flex items-center justify-center text-xs text-red-400 border border-red-200">
      取得失敗
    </div>
  )

  return (
    <img
      src={state.src}
      alt={filePath}
      className="w-48 h-48 object-cover rounded border cursor-pointer hover:opacity-80"
      onClick={() => window.electronAPI.openFile(filePath)}
    />
  )
}

type DocRowProps = {
  label: string
  filePaths: string[]
}

function DocRow({ label, filePaths }: DocRowProps) {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  const handleOpen = async (filePath: string, index: number) => {
    try {
      await window.electronAPI.openFile(filePath)
    } catch {
      setErrors(prev => ({ ...prev, [index]: true }))
    }
  }

  return (
    <div className="flex gap-2 py-2 border-b text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <div className="flex flex-col gap-1">
        {filePaths.map((filePath, index) => (
          <div key={index}>
            {errors[index]
              ? <span className="text-red-400 text-xs">ファイルを開けませんでした</span>
              : (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleOpen(filePath, index)}
                >
                  開く{filePaths.length > 1 ? `（${index + 1}）` : ''}
                </button>
              )
            }
          </div>
        ))}
      </div>
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
            {Object.entries(d.docs).map(([key, value]) => {
              if (!value) return null
              const paths = Array.isArray(value) ? value : [value]
              return (
                <DocRow
                  key={key}
                  label={DOC_LABELS[key] ?? key}
                  filePaths={paths}
                />
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}
