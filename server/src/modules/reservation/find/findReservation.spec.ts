import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Book, School, User } from '@server/entities'
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

const { create, find } = reservationRouter.createCaller(
  authContext({ db }, user)
)
const { find: find2 } = reservationRouter.createCaller(
  authContext({ db }, user2)
)

afterAll(() => {
  db.destroy()
})

it('should find the reservation that the user has', async () => {
  const result = await create({
    bookId: book.id,
  })

  const reservations = await find()

  expect(reservations[0].id).toEqual(result.id)
  expect(reservations[0].book.id).toEqual(result.bookId)
  expect(reservations[0].book.title).toEqual(book.title)
  expect(reservations[0].status).toEqual(result.status)
  expect(reservations[0].reservationDate).toEqual(result.reservationDate)
  expect(new Date(reservations[0].expireDate).toDateString).toEqual(
    new Date(result.expireDate).toDateString
  )
})

it('should not get the reservations that the user does not have', async () => {
  const reservations = await find2()

  expect(reservations.length).toEqual(0)
})
