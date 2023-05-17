import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
const pinia = createPinia()
loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(VueCookies)
  .mount('#app')
