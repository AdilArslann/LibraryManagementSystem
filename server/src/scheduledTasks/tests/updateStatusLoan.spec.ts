import { createTestDatabase } from '@tests/utils/database'
import { Loan, Reservation, Book, School, User } from '@server/entities'
import { Status } from '@server/entities/reservation'
import { LoanStatus } from '@server/entities/loan'
import { UserRoles } from '@server/entities/user'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import updateStatusLoan from '../updateStatusLoan'

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

await loanRepository.save({
  dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: reservation.userId,
  bookId: reservation.bookId,
  reservationId: reservation.id,
})

await loanRepository.save({
  dueDate: new Date(),
  userId: reservation2.userId,
  bookId: reservation2.bookId,
  reservationId: reservation2.id,
})

it('there should be no overdue loans', async () => {
  await updateStatusLoan(db)
  const loans = await loanRepository.find()
  loans.every((loan) => loan.status !== LoanStatus.OVERDUE)
})

it('should update the status of the loan', async () => {
  await updateStatusLoan(db)
  const loans = await loanRepository.find()
  loans.some((loan) => loan.status === LoanStatus.OVERDUE)
})
