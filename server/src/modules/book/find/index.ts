import { Book } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { bookSchema } from '@server/entities/book'
import { ILike } from 'typeorm'

export default authenticatedProcedure
  .input(
    bookSchema.pick({
      title: true,
    })
  )
  .query(async ({ input: { title }, ctx: { db, authUser } }) => {
    const books = await db.getRepository(Book).find({
      where: {
        schoolId: authUser.schoolId,
        title: ILike(`%${title}%`),
      },
    })

    return books
  })
