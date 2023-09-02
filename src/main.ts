import { createAuth0 } from '@auth0/auth0-vue'
// @ts-expect-error no types for vue-hotkey
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use(vuetify)

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use(VueTransitions)

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.component('AppHotkey', Hotkey)

app.use(
  createAuth0({
    domain: 'shuunen.eu.auth0.com',
    clientId: '43a38fLkm9B3sa1tUzhx1vs2Z2uJD1Fy',
    authorizationParams: {
      // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
      redirect_uri: window.location.origin,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }),
)

app.mount('#app')
