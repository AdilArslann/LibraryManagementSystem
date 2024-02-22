import './assets/style.css'

import * as Sentry from '@sentry/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useNavigationStore } from '@/stores/navigationStore'
import { sentryDSN } from './config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

if (sentryDSN) {
  console.log('Sentry DSN found, initializing Sentry...')
  Sentry.init({
    dsn: sentryDSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}
app.use(router)

app.mount('#app')

const navigationStore = useNavigationStore()

router.afterEach((to) => {
  navigationStore.setCurrentRouteName(String(to.name))
})
