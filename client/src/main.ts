import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useNavigationStore } from '@/stores/navigationStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const navigationStore = useNavigationStore()

router.afterEach((to) => {
  navigationStore.setCurrentRouteName(String(to.name))
})
