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

    accountError.value = ''
    try {
      if (!auth.member.value) await auth.loadMember()
      ready.value = true
      return true
    } catch (caught) {
      accountError.value = caught instanceof Error ? caught.message : 'Unable to load your account.'
      if (!auth.token.value) await redirectToLogin()
      ready.value = true
      return false
    }
  }

  watch(auth.token, (value) => {
    ready.value = false
    if (!value) void redirectToLogin()
  })
  return { auth, ready, accountError, initializeAccount }
}
