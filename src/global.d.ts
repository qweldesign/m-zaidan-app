export {}

declare global {
  interface Window {
    electronAPI: {
      fetchAPI: (path: string, options?: RequestInit) => Promise<{
        status: number
        data: unknown
      }>
      patchAPI: (path: string, body: unknown) => Promise<{
        status: number
        data: unknown
      }>
      fetchFile: (path: string) => Promise<{
        base64: string
        contentType: string
      }>
      openFile: (path: string) => Promise<void>
      exportCSV: () => Promise<{
        canceled: boolean
        filePath?: string
      }>
      exportPDF: (id: number) => Promise<{
        canceled: boolean
        filePath?: string
      }>
      exportReportPDF: (id: number) => Promise<{
        canceled: boolean
        filePath?: string
      }>
    }
  }
}
