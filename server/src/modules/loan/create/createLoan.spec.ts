import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Loan, Reservation, Book, School, User } from '@server/entities'
import { Status } from '@server/entities/reservation'
import { UserRoles } from '@server/entities/user'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import loanRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  schoolId: school.id,
})
const user2 = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
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

const loanRepository = db.getRepository(Loan)
const reservationRepository = db.getRepository(Reservation)
const { create } = loanRouter.createCaller(authContext({ db }, user2))

afterAll(() => {
  db.destroy()
})

it('should create a new loan and update the existing reservation for that book', async () => {
  const result = await create({
    reservationId: reservation.id,
  })

  expect(result).toHaveProperty('id')
  expect(result).toHaveProperty('bookId')
  expect(result).toHaveProperty('userId')
  expect(result).toHaveProperty('checkoutDate')
  expect(result).toHaveProperty('dueDate')
  expect(result).toHaveProperty('reservationId')
  const savedLoan = await loanRepository.findOneOrFail({
    where: {
      id: result.id,
    },
  })

  expect(savedLoan.id).toEqual(result.id)
  expect(savedLoan.bookId).toEqual(result.bookId)
  expect(savedLoan.userId).toEqual(result.userId)
  expect(savedLoan.checkoutDate).toEqual(result.checkoutDate)
  expect(new Date(savedLoan.dueDate).toISOString().split('T')[0]).toEqual(
    result.dueDate.toISOString().split('T')[0]
  )

  const savedReservation = await reservationRepository.findOneOrFail({
    where: {
      id: reservation.id,
    },
  })

  expect(savedReservation.status).toEqual(Status.COMPLETED)
})
