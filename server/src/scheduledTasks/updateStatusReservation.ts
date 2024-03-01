import { Status } from '@server/entities/reservation'
import { Reservation } from '../entities'
import { Database } from '../database'

export default async function updateStatusReservation(database: Database) {
  const reservations: Reservation[] = await database
    .getRepository(Reservation)
    .find({
      where: {
        status: Status.ACTIVE,
      },
    })

  const updatedReservations = reservations.map(updateReservationStatus)
  await database.getRepository(Reservation).save(updatedReservations)
}

function updateReservationStatus(reservation: Reservation) {
  const now = new Date()
  const updatedReservation = reservation
  if (new Date(reservation.expireDate) <= now) {
    updatedReservation.status = Status.EXPRIED
    // I guess mutating directly is not the best approach
    // reservation.status = Status.EXPRIED
  }
  return updatedReservation
}
