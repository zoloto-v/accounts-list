import '@/app/styles/main.css'
import 'vuetify/dist/vuetify.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { ru } from 'vuetify/locale'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'ru',
    fallback: 'ru',
    messages: { ru },
  },
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())

app.mount('#app')
