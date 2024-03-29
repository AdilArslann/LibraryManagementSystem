import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Loan, Reservation, Book, School, User } from '@server/entities'
import { Status } from '@server/entities/reservation'
import { LoanStatus } from '@server/entities/loan'
import { UserRoles } from '@server/entities/user'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import loanRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
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
const loan = await db.getRepository(Loan).save({
  dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: reservation.userId,
  bookId: reservation.bookId,
  reservationId: reservation.id,
})

const loan2 = await db.getRepository(Loan).save({
  dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: reservation2.userId,
  bookId: reservation2.bookId,
  reservationId: reservation2.id,
})

const loanRepository = db.getRepository(Loan)
const { returned } = loanRouter.createCaller(authContext({ db }, user))
const { returned: returned2 } = loanRouter.createCaller(
  authContext({ db }, user2)
)

afterAll(() => {
  db.destroy()
})

it('Should change the status and add the date of return', async () => {
  const completedLoan = await returned({
    id: loan.id,
  })

  expect(completedLoan.status).toEqual(LoanStatus.RETURNED)
  expect(completedLoan).toHaveProperty('returnedDate')

  const dbLoan = await loanRepository.findOneOrFail({
    where: {
      id: loan.id,
    },
  })

  expect(dbLoan.status).toEqual(LoanStatus.RETURNED)
  expect(dbLoan).toHaveProperty('returnedDate')
})

it('Should give an trpc error if no loan was found', async () => {
  await expect(
    returned({
      id: 7841,
    })
  ).rejects.toThrowError(/Loan does not exist/i)
})

it('Should give authorization error if the user is not a librarian', async () => {
  await expect(
    returned2({
      id: loan2.id,
    })
  ).rejects.toThrowError(/Access denied/i)
})
