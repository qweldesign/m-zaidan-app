// src/type/report.ts

export type ReportStatus = '確認前' | '確認済' | '要修正'

export type ReportSection1Data = {
  teamName: string
  contactName: string
  contactPhone: string
  contactEmail: string
}

export type ReportSection2Data = {
  projectName: string
  actualStartDate: string
  actualEndDate: string
  actualVenue: string
  organizerCount: number
  organizerDays: number
  participantCount: number
  participantDays: number
  actualDetail: string
  income: {
    grantRequest: number
    memberFees: number
    donations: number
    tickets: number
    incomeMemo: {
      grantRequest: string
      memberFees: string
      donations: string
      tickets: string
    }
  }
  expenses: {
    id: string
    subject: string
    amount: number
    grantUsage: number
    memo: string
  }[]
  budgetNote: string
}

export type Report = {
  id: number
  status: ReportStatus
  team_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  project_name: string
  activity_category: string
  actual_start_date: string
  actual_end_date: string
  actual_venue: string
  grant_request_amount: number
  total_expense_amount: number
  grant_usage_amount: number
  report_section1_json: ReportSection1Data
  report_section2_json: ReportSection2Data
  edit_token: string | null
  created_at: string
  updated_at: string
  is_deleted: number
  deleted_at: string | null
}
