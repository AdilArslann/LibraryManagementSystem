import { Database } from '../database'
import updateStatusReservation from './updateStatusReservation'
import updateStatusLoan from './updateStatusLoan'

export default async function startScheduledTasks(database: Database) {
  // Update the status of reservations and loans every day at 00:00
  await updateStatusReservation(database)
  await updateStatusLoan(database)
}
