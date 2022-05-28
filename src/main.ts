import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles.css'
import './register-service-worker'
import { store } from './store'

const app = createApp(App)
app.use(store)
app.mount('#app')
