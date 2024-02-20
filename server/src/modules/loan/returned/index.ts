import { Loan, Book } from '@server/entities'
import { loanSchema, LoanStatus } from '@server/entities/loan'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    loanSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    const loan = await db.getRepository(Loan).findOne({
      where: {
        id: input.id,
      },
    })

    if (!loan) {
      throw new TRPCError({
        message: 'Loan does not exist',
        code: 'NOT_FOUND',
      })
    }
    const book = await db.getRepository(Book).findOne({
      where: {
        id: loan.bookId,
        schoolId: authUser.schoolId,
      },
    })

    if (!book) {
      throw new TRPCError({
        message:
          'There was a problem with finding the book to cancel the reservation',
        code: 'NOT_FOUND',
      })
    }

    loan.returnedDate = new Date()
    loan.status = LoanStatus.RETURNED
    book.availableQuantity += 1
    await db.getRepository(Loan).save(loan)
    await db.getRepository(Book).save(book)

    return loan
  })
