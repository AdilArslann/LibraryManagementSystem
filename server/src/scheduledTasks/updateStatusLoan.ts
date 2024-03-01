import { LoanStatus } from '@server/entities/loan'
import { Database } from '../database'
import { Loan } from '../entities'

export default async function updateStatusLoan(database: Database) {
  const loans: Loan[] = await database.getRepository(Loan).find({
    where: {
      status: LoanStatus.CHECKED_OUT,
    },
  })

  const updatedLoans = loans.map(updateLoanStatus)
  await database.getRepository(Loan).save(updatedLoans)
}

function updateLoanStatus(loan: Loan) {
  const now = new Date()
  const updatedLoan = loan
  if (new Date(loan.dueDate) <= now) {
    updatedLoan.status = LoanStatus.OVERDUE
  }
  return updatedLoan
}
