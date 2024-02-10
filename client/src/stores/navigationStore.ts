import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const currentRouteName = ref('Dashboard')

  const setCurrentRouteName = (routeName: string) => {
    currentRouteName.value = routeName
  }
  return {
    currentRouteName,
    setCurrentRouteName,
  }
})
