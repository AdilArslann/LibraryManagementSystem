<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert } from 'flowbite-vue'
import type { ReservationShowcase } from '@mono/server/src/shared/entities'
import Reservation from '@/components/Reservation.vue'


const reservations = ref<ReservationShowcase[]>([])



onBeforeMount(async () => {
  reservations.value = await trpc.reservation.find.query()
})
</script>

<template>
  <div class="ReservationView">
    <div v-if="reservations.length" class="reservationList" data-testid="reservationList">
      <Reservation v-for="reservation in reservations" :key="reservation.id" :reservation="reservation" />
    </div>
    <FwbAlert v-else data-testid="reservationListEmpty">There are no reservations</FwbAlert>
  </div>
</template>


<style scoped>
.reservationList {
  display: flex;
  flex-direction: column-reverse;
}
</style>