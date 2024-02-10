import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Reservation, Book, School, User } from '@server/entities'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import { Status } from '@server/entities/reservation'
import reservationRouter from '..'

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
  quantity: 1,
  availableQuantity: 1,
  schoolId: school.id,
})
const reservation = await db.getRepository(Reservation).save({
  bookId: book.id,
  userId: user.id,
  expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
})

const reservationRepository = db.getRepository(Reservation)
const { cancel } = reservationRouter.createCaller(authContext({ db }, user))
const { cancel: cancel2 } = reservationRouter.createCaller(
  authContext({ db }, user2)
)

afterAll(() => {
  db.destroy()
})

it('other users should not be able to cancel other peoples reservation', async () => {
  await expect(
    cancel2({
      id: reservation.id,
    })
  ).rejects.toThrow(/No reservation found to cancel/i)
})

it('User should be able to cancel their active reservation', async () => {
  const cancelledReservation = await cancel({ id: reservation.id })

  expect(cancelledReservation.status).toBe(Status.CANCELLED)

  const reservationNew = await reservationRepository.findOne({
    where: {
      id: reservation.id,
    },
  })

  expect(reservationNew).toMatchObject(cancelledReservation)
})
