export interface ReferralCode { code: string; link: string; status: number }
export interface ReferralSummary {
  enabled: boolean; eligible: boolean; invitedCount: number
  rewards: { rewardEnabled: boolean; pointsPerInvite: number; dailyLimit: number; remainingToday: number; rewardedCount: number; grantedPoints: number; resetsAt: string }
}
export interface ReferralRow { id: number; friend: string; boundTime: string; points: number; status: number; reason?: string }
export const useReferrals = () => {
  const auth = useMemberAuth()
  return {
    code: () => auth.request<ReferralCode>('/member/referrals/code'),
    summary: () => auth.request<ReferralSummary>('/member/referrals/summary', undefined, 'GET'),
    page: (page: number) => auth.request<{ list: ReferralRow[]; total: number; page: number; size: number }>(`/member/referrals/page?page=${page}&size=20`, undefined, 'GET'),
    context: () => auth.publicRequest<{ inviteCode: string | null }>('/referrals/context'),
    capture: (inviteCode: string) => auth.publicAction<{ inviteCode: string }>('/referrals/context', { inviteCode }),
    clear: () => auth.publicAction<void>('/referrals/context', undefined, 'DELETE'),
    validate: (inviteCode: string) => auth.publicAction<{ inviteCode: string }>('/referrals/validate', { inviteCode }),
  }
}
