import { createTestDatabase } from '@tests/utils/database'
import { Reservation, Book, School, User } from '@server/entities'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import { Status } from '@server/entities/reservation'
import updateStatusReservation from '../updateStatusReservation'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  schoolId: school.id,
})
const user2 = await db.getRepository(User).save({
  ...fakeUser(),
  schoolId: school.id,
})
const book = await db.getRepository(Book).save({
  ...fakeBook(),
  title: 'test',
  authors: ['test'],
  publisher: 'test',
  publicationYear: 'test',
  description: 'test',
  quantity: 2,
  availableQuantity: 1,
  schoolId: school.id,
})
await db.getRepository(Reservation).save({
  bookId: book.id,
  userId: user.id,
  expireDate: new Date(),
})
await db.getRepository(Reservation).save({
  bookId: book.id,
  userId: user2.id,
  expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
})

it('should not have any reservation with status expired', async () => {
  const reservations = await db.getRepository(Reservation).find()

  reservations.every((reservation) => reservation.status !== Status.EXPRIED)
})

it('should update the status of the reservation to expired', async () => {
  await updateStatusReservation(db)

  const reservations = await db.getRepository(Reservation).find()

  reservations.some((reservation) => reservation.status === Status.EXPRIED)
})
