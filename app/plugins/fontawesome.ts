import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowUpRightFromSquare,
  faArrowRightToBracket,
  faBars,
  faBookOpen,
  faChevronLeft,
  faChevronRight,
  faCircleNotch,
  faCog,
  faEye,
  faEyeSlash,
  faGift,
  faGlobe,
  faHeart,
  faLock,
  faMagnifyingGlass,
  faMap,
  faMapMarkerAlt,
  faMedal,
  faPlay,
  faPlus,
  faTimes,
  faUser,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faGoogle,
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
  faCircleNotch,
  faCog,
  faEye,
  faEyeSlash,
  faFacebook,
  faGift,
  faGlobe,
  faGoogle,
  faHeart,
  faInstagram,
  faLock,
  faMagnifyingGlass,
  faMap,
  faMapMarkerAlt,
  faMedal,
  faPinterest,
  faPlay,
  faPlus,
  faTimes,
  faTwitter,
  faUser,
  faXmark
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
