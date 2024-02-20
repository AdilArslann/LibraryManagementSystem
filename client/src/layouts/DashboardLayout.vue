<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue'
import StackedLayout from './StackedLayout.vue'
import { logout } from '@/stores/user'
import { useRouter } from 'vue-router'
import { authUserRole } from '@/stores/user'
import { computed } from 'vue'

const router = useRouter()
const userRole = authUserRole.value
const allLinks = [{ label: 'Dashboard', name: 'Dashboard' }, { label: 'Create Book', name: 'CreateBook' }, { label: 'Create School', name: 'CreateSchool' }, { label: 'Create Librarian', name: 'CreateLibrarian' }, { label: 'Manage Reservations', name: 'Reservations' }, { label: 'Manage Loans', name: 'Loans' }]

const links = computed(() => {
  if (userRole === 'admin') {
    return allLinks
  } else if (userRole === 'librarian') {
    return allLinks.filter(link => ['Dashboard', 'CreateBook', 'Reservations', 'Loans'].includes(link.name))
  } else {
    return allLinks.filter(link => ['Dashboard', 'Reservations'].includes(link.name))
  }
})

function logoutUser() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <StackedLayout :links="links">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#">Logout</FwbNavbarLink>
    </template>
  </StackedLayout>
</template>
