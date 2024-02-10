import { Book } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db, authUser } }) => {
    const count = await db.getRepository(Book).count({
      where: {
        schoolId: authUser.schoolId,
      },
    })
    const pages = Math.max(1, Math.ceil(count / 12))
    return pages
  }
)
