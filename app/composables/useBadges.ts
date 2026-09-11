export interface BadgeDefinition {
  id: number; code: string; category: 'NORMAL' | 'LEVEL' | 'EVENT'; nameEn: string; nameZh: string
  descriptionEn: string; descriptionZh: string; iconKey?: string | null; lockedIconKey?: string | null
  iconUrl?: string | null; lockedIconUrl?: string | null; acquisition: 'AUTO' | 'MANUAL' | 'REDEEM'
  ruleType?: string | null; target: number; levelCode?: string | null; activityName?: string | null
  startTime?: string | null; endTime?: string | null; price?: number | null; priceVersion: number
  stock?: number | null; issued: number; status: string; version: number
}
export interface MemberBadge {
  definition: BadgeDefinition; progress: number; holdingStatus?: 'EARNED' | 'REVOKED' | null
  source?: string | null; earnedTime?: string | null; occurredTime?: string | null
  readTime?: string | null; wearPosition?: number | null
}
export interface BadgeSummary {
  currentLevelBadge?: BadgeDefinition | null
  earned: number; available: number; unread: number; worn: MemberBadge[]
  account: { levelCode: string; levelName: string; levelPoints: number; availablePoints: number }
}
export interface BadgePage { list: MemberBadge[]; total: number; page: number; size: number }
export const useBadges = () => {
  const auth = useMemberAuth()
  const name = (b: BadgeDefinition) => auth.member.value?.locale?.startsWith('zh') ? b.nameZh : b.nameEn
  const description = (b: BadgeDefinition) => auth.member.value?.locale?.startsWith('zh') ? b.descriptionZh : b.descriptionEn
  const summary = () => auth.request<BadgeSummary>('/badges/summary', undefined, 'GET')
  const page = (page: number, category = '', state = '') => auth.request<BadgePage>(
    '/badges/page?' + new URLSearchParams({ page: String(page), size: '20', category, state }), undefined, 'GET')
  const detail = (id: number) => auth.request<MemberBadge>(`/badges/${id}`, undefined, 'GET')
  const wear = (badgeIds: number[]) => auth.request<void>('/badges/wear', { badgeIds }, 'PUT')
  const read = (id: number) => auth.request<void>(`/badges/${id}/read`, {})
  const redeem = (b: BadgeDefinition, requestKey: string) => auth.request(
    `/badges/${b.id}/redeem`, { requestKey, priceVersion: b.priceVersion })
  return { auth, name, description, summary, page, detail, wear, read, redeem }
}
