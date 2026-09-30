import { createAuth0 } from '@auth0/auth0-vue'
import VueTransitions from '@morev/vue-transitions'
import '@morev/vue-transitions/styles'
import { Hotkey } from '@simolation/vue-hotkey'
import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles.css'
import { vuetify } from './plugins/vuetify.plugin'
import './plugins/webfont.plugin'
import './register-service-worker'

const app = createApp(App)

app.use(vuetify)

app.use(VueTransitions)

app.component('AppHotkey', Hotkey)

app.use(
  createAuth0({
    authorizationParams: {
      redirect_uri: globalThis.location.origin,
    },
    cacheLocation: 'localstorage',
    clientId: '43a38fLkm9B3sa1tUzhx1vs2Z2uJD1Fy',
    domain: 'shuunen.eu.auth0.com',
    useRefreshTokens: true,
  }),
)

app.mount('#app')
