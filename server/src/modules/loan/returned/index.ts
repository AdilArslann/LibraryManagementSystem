import { Loan } from '@server/entities'
import { loanSchema, LoanStatus } from '@server/entities/loan'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    loanSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
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

    loan.returnedDate = new Date()
    loan.status = LoanStatus.RETURNED

    await db.getRepository(Loan).save(loan)

    return loan
  })
