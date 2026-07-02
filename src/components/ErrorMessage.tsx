// src/components/ErrorMessage.tsx

type Props = {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="text-4xl">⚠️</div>
      <p className="text-gray-700 font-medium">データを取得できませんでした</p>
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={onRetry}
        >
          再試行
        </button>
      )}
    </div>
  )
}
