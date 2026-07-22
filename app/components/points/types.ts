export interface PointsAccount {
  memberId: number
  availablePoints: number
  frozenPoints: number
  totalEarnedPoints: number
  totalSpentPoints: number
  totalExpiredPoints: number
  levelPoints: number
  levelCode: string
  levelName: string
  nextLevelPoints: number
}

export interface Transaction {
  transactionNo: string
  memberId: number
  ruleCode: string
  changeType: number
  availableDelta: number
  availableBefore: number
  availableAfter: number
  levelPointsDelta: number
  bizType: string
  bizId: string
  remark: string
  occurredTime: string
}

export interface TransactionPageResponse {
  list: Transaction[]
  total: number
  page: number
  size: number
}

export type FilterType = 0 | 1 | 2