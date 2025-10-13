import '@/app/styles/main.css'
import 'vuetify/dist/vuetify.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())

app.mount('#app')
