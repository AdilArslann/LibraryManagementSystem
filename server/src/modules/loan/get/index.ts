import { Loan } from '@server/entities'
import { LoanShowcase } from '@server/entities/loan'
import { UserRoles } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db, authUser } }) => {
    let loans = []
    if (authUser.role === UserRoles.LIBRARIAN) {
      loans = (await db.getRepository(Loan).find({
        where: {
          user: {
            schoolId: authUser.schoolId,
          },
        },
        relations: ['book', 'user'],
      })) as LoanShowcase[]
    } else {
      loans = (await db.getRepository(Loan).find({
        where: {
          userId: authUser.id,
        },
        relations: ['book', 'user'],
      })) as LoanShowcase[]
    }

    return loans
  }
)
