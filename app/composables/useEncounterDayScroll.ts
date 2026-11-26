export function useEncounterDayScroll() {
  const page = useTemplateRef<HTMLElement>('page')
  const bookingBar = useTemplateRef<HTMLElement>('bookingBar')
  const closing = useTemplateRef<HTMLElement>('closing')
  let observer: IntersectionObserver | undefined
  const revealTimers = new Set<ReturnType<typeof setTimeout>>()

  function updateBookingBar() {
    const top = closing.value?.getBoundingClientRect().top ?? Infinity
    const hidden = window.scrollY <= window.innerHeight * 0.6 || top <= 100
    bookingBar.value?.classList.toggle('hidden', hidden)
    if (bookingBar.value) bookingBar.value.inert = hidden
  }

  onMounted(() => {
    const reveals = page.value?.querySelectorAll('.reveal')
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return
          const timer = setTimeout(() => {
            entry.target.classList.add('in')
            revealTimers.delete(timer)
          }, index % 4 * 80)
          observer?.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
      reveals?.forEach(element => observer?.observe(element))
    } else {
      reveals?.forEach(element => element.classList.add('in'))
    }
    if (window.scrollY > 0) updateBookingBar()
    window.addEventListener('scroll', updateBookingBar, { passive: true })
    window.addEventListener('resize', updateBookingBar)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    revealTimers.forEach(timer => clearTimeout(timer))
    window.removeEventListener('scroll', updateBookingBar)
    window.removeEventListener('resize', updateBookingBar)
  })
}
