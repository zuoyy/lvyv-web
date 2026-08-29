import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
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

// Prevent FontAwesome from dynamically adding its CSS since we imported it directly
config.autoAddCss = false

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
