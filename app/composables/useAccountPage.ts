export const useAccountPage = (redirectPath: string) => {
  const auth = useMemberAuth()
  const ready = ref(false)
  const accountError = ref('')

  const redirectToLogin = () => navigateTo(
    `/login/?redirect=${encodeURIComponent(redirectPath)}`,
    { replace: true },
  )

  const initializeAccount = async () => {
    if (!auth.token.value) {
      await redirectToLogin()
      return false
    }

    try {
      if (!auth.member.value) await auth.loadMember()
      ready.value = true
      return true
    } catch (caught) {
      auth.clearSession()
      accountError.value = caught instanceof Error ? caught.message : 'Unable to load your account.'
      await redirectToLogin()
      return false
    }
  }

  return { auth, ready, accountError, initializeAccount }
}
