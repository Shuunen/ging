import { Hotkey } from '@simolation/vue-hotkey'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles.css'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './register-service-worker'

loadFonts()

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(vuetify)

// globally register components, restrict the regex if needed
const requireComponent = require.context('./components', true, /\.vue$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.split('/').pop()?.replace(/\.\w+$/, '') ?? fileName
  app.component(componentName, componentConfig.default || componentConfig)
})

app.component('AppHotkey', Hotkey)

app.mount('#app')
