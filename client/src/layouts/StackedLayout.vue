<script lang="ts" setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigationStore'
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'

const { links } = defineProps<{
  links: {
    label: string
    name: string
  }[]
}>()

const navigationStore = useNavigationStore()

const navigation = computed(() => {
  return links.map((item) => ({
    ...item,
    isActive: navigationStore.currentRouteName === item.name,
  }))
})
</script>

<template>
  <FwbNavbar>
    <template #default="{ isShowMenu }">
      <FwbNavbar-collapse :isShowMenu="isShowMenu">
        <!-- prettier-ignore -->
        <FwbNavbarLink v-for="link in navigation" :key="`${link.name}-${link.isActive}`" :is-active="link.isActive"
          :link="({ name: link.name } as any)" link-attr="to" component="RouterLink">
          {{ link.label }}
        </FwbNavbarLink>
        <slot name="menu" />
      </FwbNavbar-collapse>
    </template>
  </FwbNavbar>

  <main>
    <div class="container px-1 py-2 md:mx-auto">
      <RouterView />
    </div>
  </main>
</template>
