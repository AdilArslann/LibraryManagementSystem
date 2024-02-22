<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { FwbAlert } from 'flowbite-vue'
import Reservation from '@/components/Reservation.vue'
import { useReservationStore } from '@/stores/reservationStore'

const reservationsStore = useReservationStore()

onBeforeMount(async () => {
  reservationsStore.setReservations()
})
</script>

<template>
  <div class="ReservationView">
    <div
      v-if="reservationsStore.reservations.length"
      class="reservationList"
      data-testid="reservationList"
    >
      <Reservation
        v-for="reservation in reservationsStore.reservations"
        :key="reservation.id"
        :reservationId="reservation.id"
      />
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
