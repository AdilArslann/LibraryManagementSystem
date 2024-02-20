import { Book } from '@server/entities'
import type { BookShowcase } from '@server/entities/book'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { SelectQueryBuilder } from 'typeorm'
import { z } from 'zod'

export default authenticatedProcedure
  .input(
    z.object({
      page: z.number().min(0),
      title: z.string().optional(),
      publishers: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
    })
  )
  .query(
    async ({
      input: { page, publishers, authors, title },
      ctx: { db, authUser },
    }) => {
      let query: SelectQueryBuilder<Book> = db
        .getRepository(Book)
        .createQueryBuilder('book')

      query = query.where('book.schoolId = :schoolId', {
        schoolId: authUser.schoolId,
      })

      if (title) {
        query = query.andWhere(
          'to_tsvector(book.title) @@ plainto_tsquery(:title)',
          {
            title,
          }
        )
      }

      if (publishers) {
        query = query.andWhere('book.publisher IN (:...publishers)', {
          publishers,
        })
      }
      if (authors) {
        // https://stackoverflow.com/a/1647426
        query = query.andWhere('book.authors && :authors', {
          authors,
        })
      }
      const books = await query
        .select([
          'book.id',
          'book.title',
          'book.authors',
          'book.coverImageUrl',
          'book.publisher',
        ])
        .skip(page * 12)
        .take(12)
        .orderBy('book.title', 'ASC')
        .getMany()

      return books as BookShowcase[]
    }
  )
