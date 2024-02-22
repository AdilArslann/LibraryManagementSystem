import { Loan } from '@server/entities'
import type { LoanShowcase } from '@server/entities/loan'
import { UserRoles } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db, authUser } }) => {
    let loans: LoanShowcase[]
    if (authUser.role === UserRoles.LIBRARIAN) {
      loans = await db.getRepository(Loan).find({
        where: {
          user: {
            schoolId: authUser.schoolId,
          },
        },
        relations: ['book', 'user'],
        order: {
          status: 'ASC',
          checkoutDate: 'DESC',
        },
      })
    } else {
      loans = await db.getRepository(Loan).find({
        where: {
          userId: authUser.id,
        },
        relations: ['book', 'user'],
        order: {
          status: 'ASC',
          checkoutDate: 'DESC',
        },
      })
    }

    return loans
  }
)
