import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Status, type ReservationShowcase } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref<ReservationShowcase[]>([])

  const setReservations = async () => {
    reservations.value = await trpc.reservation.find.query()
  }

  const cancelReservation = async (reservationId: number) => {
    await trpc.reservation.cancel.mutate({ id: reservationId })
    const reservation = reservations.value.find((res) => res.id === reservationId)
    if (reservation) {
      reservation.status = 'Canceled' as Status.CANCELLED
    }
  }

  const completeReservation = async (reservationId: number) => {
    await trpc.loan.create.mutate({ reservationId: reservationId })
    const reservation = reservations.value.find((res) => res.id === reservationId)
    if (reservation) {
      reservation.status = 'Completed' as Status.COMPLETED
    }
  }

  const getOne = (reservationId: number) => {
    return reservations.value.find(
      (reservation) => reservation.id === reservationId
    ) as ReservationShowcase
  }

  return {
    reservations,
    setReservations,
    cancelReservation,
    completeReservation,
    getOne,
  }
})
