import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faPinterest,
  faReddit,
  faTiktok,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

library.add(
  fas,
  faFacebook,
  faGoogle,
  faInstagram,
  faPinterest,
  faReddit,
  faTiktok,
  faTwitter,
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
