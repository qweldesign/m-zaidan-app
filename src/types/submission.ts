// src/types/submission.ts

export type SubmissionStatus = '未審査' | '審査中' | '承認' | '否決' | '保留'

export type Submission = {
  id: number
  status: SubmissionStatus
  team_name: string
  team_name_kana: string
  team_postal_code: string
  team_address: string
  established_year: number
  activity_category: 'ボランティア活動' | 'スポーツ活動' | 'その他市民活動'
  representative_name: string
  representative_email: string
  representative_phone: string
  contact_name: string
  contact_email: string
  contact_phone: string
  project_name: string
  start_date: string
  end_date: string
  venue: string
  grant_request_amount: number
  total_expense_amount: number
  grant_usage_amount: number
  section1_json: string
  section2_json: string
  section3_json: string
  section4_json: string
  section5_json: string
  created_at: string
  updated_at: string
}
