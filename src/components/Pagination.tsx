// src/components/Pagination.tsx

type Props = {
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export default function Pagination({ total, limit, offset, onPageChange }: Props) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-2 py-3 text-sm text-gray-600">
      <span>{total}件中 {offset + 1}〜{Math.min(offset + limit, total)}件を表示</span>
      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
          disabled={currentPage === 1}
          onClick={() => onPageChange(0)}
        >
          «
        </button>
        <button
          className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
          disabled={currentPage === 1}
          onClick={() => onPageChange(offset - limit)}
        >
          ‹
        </button>
        <span className="px-3">{currentPage} / {totalPages}</span>
        <button
          className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(offset + limit)}
        >
          ›
        </button>
        <button
          className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange((totalPages - 1) * limit)}
        >
          »
        </button>
      </div>
    </div>
  )
}
