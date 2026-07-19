import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightToBracket,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faPlay
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faArrowRightToBracket,
  faChevronLeft,
  faChevronRight,
  faFacebook,
  faGlobe,
  faInstagram,
  faPinterest,
  faPlay,
  faTwitter
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
