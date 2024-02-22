import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Loan, Reservation, Book, School, User } from '@server/entities'
import { Status } from '@server/entities/reservation'
import { UserRoles } from '@server/entities/user'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import loanRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const loanRepository = db.getRepository(Loan)
const user = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
  schoolId: school.id,
})
const user2 = await db.getRepository(User).save({
  ...fakeUser(),
  schoolId: school.id,
})

const user3 = await db.getRepository(User).save({
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
  status: Status.ACTIVE,
  reservationDate: new Date(),
  expireDate: new Date(),
})
const reservation2 = await db.getRepository(Reservation).save({
  bookId: book.id,
  userId: user2.id,
  status: Status.ACTIVE,
  reservationDate: new Date(),
  expireDate: new Date(),
})

const loan = await loanRepository.save({
  dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: reservation.userId,
  bookId: reservation.bookId,
  reservationId: reservation.id,
})

const loan2 = await loanRepository.save({
  dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: reservation2.userId,
  bookId: reservation2.bookId,
  reservationId: reservation2.id,
})

const { get } = loanRouter.createCaller(authContext({ db }, user))
const { get: get2 } = loanRouter.createCaller(authContext({ db }, user2))
const { get: get3 } = loanRouter.createCaller(authContext({ db }, user3))

afterAll(() => {
  db.destroy()
})

it('should get all loans from the librarian school', async () => {
  const loans = await get()

  const loansFromSchool = loanRepository.find({
    where: {
      user: {
        schoolId: user.schoolId,
      },
    },
    relations: ['book', 'user'],
    order: {
      status: 'ASC',
      checkoutDate: 'DESC',
    },
  })

  expect(loans.length).toBeGreaterThanOrEqual(2)
  expect(loans).toMatchObject(loansFromSchool)
})

it('should get all loans from the user', async () => {
  const loans = await get2()

  expect(loans.every((loann) => loann.user.name === user2.name)).toBeTruthy()
})

it('User without loans should return an empty array', async () => {
  const loans = await get3()

  expect(loans.length).toEqual(0)
})
