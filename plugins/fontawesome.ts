import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowUpRightFromSquare,
  faArrowRightToBracket,
  faBars,
  faBookOpen,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faMagnifyingGlass,
  faPlay,
  faUser,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faArrowUpRightFromSquare,
  faArrowRightToBracket,
  faBars,
  faBookOpen,
  faChevronLeft,
  faChevronRight,
  faFacebook,
  faGlobe,
  faInstagram,
  faMagnifyingGlass,
  faPinterest,
  faPlay,
  faTwitter,
  faUser,
  faXmark
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
