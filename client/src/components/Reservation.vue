<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import { authUserRole, authUserId } from '@/stores/user'
import { useReservationStore } from '@/stores/reservationStore'

const userId = authUserId.value
const userRole = authUserRole.value
const reservationsStore = useReservationStore()

const props = defineProps<{
  reservationId: number
}>()

const reservation = reservationsStore.getOne(props.reservationId)
const checkIfStatusActive = (status: string) => {
  return status === 'Active'
}

const checkIfStatusExpired = (status: string) => {
  return status === 'Expired'
}
const checkIfSamePerson = (reservationUserId: number) => {
  return userId === reservationUserId
}

const formatDate = (date: Date | string) => {
  // https://stackoverflow.com/questions/47349417/javascript-date-now-to-readable-format
  return new Date(date).toUTCString()
}
</script>

<template>
  <div class="reservation" data-testid="reservationShowcase">
    <div class="details">
      <h1 class="title">
        {{ reservation.book.title }}
      </h1>
      <p v-if="userRole === 'librarian'" class="user" data-testid="resOwnerName">
        <strong>Reserved For:</strong> {{ reservation.user.name }}
      </p>
      <p class="dates">
        <strong>Reserved On:</strong><br />
        {{ formatDate(reservation.reservationDate) }}<br />
        <strong>Expire Date:</strong><br />
        {{ formatDate(reservation.expireDate) }}
      </p>
      <p :class="['status', reservation.status]" :data-testid="reservation.status">
        {{ reservation.status }}
      </p>
    </div>
    <div class="actions">
      <div class="whenActive" v-if="checkIfStatusActive(reservation.status)">
        <FwbButton v-if="checkIfSamePerson(reservation.user.id)"
          @click="reservationsStore.cancelReservation(reservation.id)" data-testid="cancelReservation">Cancel Reservation
        </FwbButton>
        <FwbButton v-if="userRole === 'librarian'" @click="reservationsStore.completeReservation(reservation.id)"
          data-testid="completeReservation">Complete Reservation
        </FwbButton>
      </div>
      <div class="whenExpired" v-if="checkIfStatusExpired(reservation.status)">
        <FwbButton v-if="userRole === 'librarian'" data-testid="renewReservation">
          Renew Reservation
        </FwbButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  margin: 0.3rem;
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  text-align: start;
  font-size: 0.8rem;
}

.user {
  text-decoration: underline;
  font-weight: bold;
  color: #000;
}

.details {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: row;
}

.actions>*>* {
  margin: 0.3rem;
}

.title {
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1;
}

@media (width >=768px) {
  .reservation {
    flex-direction: row;
    text-align: center;
  }

  .details {
    align-items: flex-start;
    text-align: start;
    width: 70%;
  }

  .actions {
    flex-direction: column;
    align-items: center;
    width: 30%;
  }
}

.status {
  display: flex;
  padding: 0.625rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
}

.status::before {
  content: '';
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  margin-right: 10%;
}



.Active::before {
  background-color: green;
}

.Expired::before {
  background-color: red;
}

.Canceled::before {
  background-color: grey;
}

.Completed::before {
  background-color: blue;
}

.status.Completed {
  color: blue;
  background-color: deepskyblue;
}

.status.Active {
  color: green;
  background-color: lightgreen;
}

.status.Expired {
  color: red;
  background-color: lightcoral;
}

.status.Canceled {
  color: grey;
  background-color: lightgrey;
}
</style>
