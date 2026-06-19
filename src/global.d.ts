export {}

declare global {
  interface Window {
    electronAPI: {
      fetchAPI: (path: string, options?: RequestInit) => Promise<{
        status: number
        data: unknown
      }>
    }
  }
}
