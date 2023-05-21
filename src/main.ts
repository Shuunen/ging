import { createAuth0 } from '@auth0/auth0-vue'
import { Hotkey } from '@simolation/vue-hotkey'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles.css'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './register-service-worker'

void loadFonts()

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use(vuetify)

// globally register components, restrict the regex if needed
// eslint-disable-next-line putout/putout
const requireComponent = require.context('./components', true, /\.vue$/u)
requireComponent.keys().forEach(fileName => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.split('/').pop()?.replace(/\.\w+$/u, '') ?? fileName
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access
  app.component(componentName, componentConfig.default || componentConfig)
})

app.component('AppHotkey', Hotkey)

app.use(
  createAuth0({
    domain: 'shuunen.eu.auth0.com',
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    client_id: '43a38fLkm9B3sa1tUzhx1vs2Z2uJD1Fy',
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    redirect_uri: window.location.origin,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }),
)

app.mount('#app')
