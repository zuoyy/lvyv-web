import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '~/assets/css/element-variables.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})
