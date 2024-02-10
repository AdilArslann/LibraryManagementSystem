import { Book } from '@server/entities'
import type { BookShowcase } from '@server/entities/book'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'

export default authenticatedProcedure
  .input(
    z.object({
      page: z.number().min(0),
    })
  )
  .query(async ({ input: { page }, ctx: { db, authUser } }) => {
    const books = (await db.getRepository(Book).find({
      select: ['id', 'title', 'authors', 'coverImageUrl'],
      where: {
        schoolId: authUser.schoolId,
      },
      skip: page * 12,
      take: 12,
    })) as BookShowcase[]

    return books
  })
