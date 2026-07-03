// src/types/submission.ts

export type SubmissionStatus = '審査中' | '承認' | '否決' | '対象外'

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
  section1_json: Section1
  section2_json: Section2
  section3_json: Section3
  section4_json: Section4
  section5_json: Section5
  created_at: string
  updated_at: string
}

export type Section1 = {
  teamName: string
  teamNameKana: string
  teamPostalCode: string
  teamAddress: string
  establishedYear: string
  members: {
    under20: number
    age21to40: number
    age41to60: number
    over61: number
  }
  activityCategory: string
  grantHistory: {
    thisFoundationCount: number
    thisFoundationLatestYear: string
    otherFoundationCount: number
    otherFoundationLatestYear: string
  }
  applicationHistory: {
    count: number
    latestYear: string
  }
  applicationRoute: string[]
  applicationRouteOther: string
  representativeName: string
  representativeNameKana: string
  representativePhone: string
  representativeEmail: string
  sameAsRepresentative: boolean
}

export type Section2 = {
  projectName: string
  startDate: string
  endDate: string
  venue: string
  recruitmentArea: string
  organizer: {
    count: string
    days: string
    total: number
  }
  participants: {
    count: string
    days: string
    total: number
  }
  projectDetail: string
  projectPurpose: string
  projectPR: string
  coOrganizers: string
}

export type Section3 = {
  income: {
    grantRequest: string
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
    amount: string
    grantUsage: string
    memo: string
  }[]
  budgetNote: string
}

export type Section4 = {
  establishmentPurpose: string[]
  establishmentBackground: string
  activityFrequency: string
  activityContent: string
  hasAward: 'あり' | 'なし'
  awardDetail: string
  hasCommunityInvolvement: 'あり' | 'なし'
  communityInvolvementDetail: string
  prNote: string
}

export type Section5 = {
  photos: string[]
  docs: {
    regulations?: string
    activityReport?: string
    financialReport?: string
    activityPlan?: string
    financialPlan?: string
  }
}
