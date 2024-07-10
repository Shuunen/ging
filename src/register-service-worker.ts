/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */
import { type Hooks, register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  const hooks: Hooks = {
    cached () {
      console.log('Content has been cached for offline use.')
    },
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    error (error) {
      console.error('Error during service worker registration:', error)
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    ready: () => {
      console.log('App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB')
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
  }
  register(`${process.env.BASE_URL ?? ''}service-worker.js`, hooks)
}
