interface AuthModalState {
  visible: boolean
  initialTab: 'login' | 'register'
}

export const useAuthModal = () => {
  const state = useState<AuthModalState>('auth-modal', () => ({
    visible: false,
    initialTab: 'login'
  }))

  const openLogin = () => {
    state.value = { visible: true, initialTab: 'login' }
  }

  const openRegister = () => {
    state.value = { visible: true, initialTab: 'register' }
  }

  const close = () => {
    state.value = { ...state.value, visible: false }
  }

  return {
    visible: computed(() => state.value.visible),
    initialTab: computed(() => state.value.initialTab),
    openLogin,
    openRegister,
    close
  }
}
