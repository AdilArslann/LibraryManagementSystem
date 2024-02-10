import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Reservation, Book, School, User } from '@server/entities'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
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

const reservationRepository = db.getRepository(Reservation)
const { create } = reservationRouter.createCaller(authContext({ db }, user))
const { create: create2 } = reservationRouter.createCaller(
  authContext({ db }, user2)
)

afterAll(() => {
  db.destroy()
})

it('should create a new reservation', async () => {
  const result = await create({
    bookId: book.id,
  })

  expect(result).toHaveProperty('id')
  expect(result).toHaveProperty('bookId')
  expect(result).toHaveProperty('userId')
  expect(result).toHaveProperty('status')
  expect(result).toHaveProperty('reservationDate')
  expect(result).toHaveProperty('expireDate')
  const savedReservation = await reservationRepository.findOneOrFail({
    where: {
      id: result.id,
    },
  })

  expect(savedReservation.id).toEqual(result.id)
  expect(savedReservation.bookId).toEqual(result.bookId)
  expect(savedReservation.userId).toEqual(result.userId)
  expect(savedReservation.status).toEqual(result.status)
  expect(savedReservation.reservationDate).toEqual(result.reservationDate)
  expect(new Date(savedReservation.expireDate).toDateString()).toEqual(
    new Date(result.expireDate).toDateString()
  )
})

it('should throw an error if the book is not available', async () => {
  await expect(
    create2({
      bookId: book.id,
    })
  ).rejects.toThrow('Book is not available')
})
