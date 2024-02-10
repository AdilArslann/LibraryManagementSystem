import { Book } from '@server/entities'
import { type BookBare, bookSchema } from '@server/entities/book'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(bookSchema.shape.id)
  .query(async ({ input, ctx: { db, authUser } }) => {
    const book = (await db.getRepository(Book).findOne({
      where: {
        schoolId: authUser.schoolId,
        id: input,
      },
    })) as BookBare

    return book
  })
