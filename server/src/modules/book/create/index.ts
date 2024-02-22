import { Book } from '@server/entities'
import { bookSchema } from '@server/entities/book'
import axios from 'axios'
import { TRPCError } from '@trpc/server'
import config from '@server/config'
import { librarianAuthorizedProcedure } from '@server/trpc/authorizedProcedure'

export default librarianAuthorizedProcedure
  .input(
    bookSchema.pick({
      isbn: true,
      quantity: true,
    })
  )
  .mutation(
    async ({ input: { isbn: bookIsbn, quantity }, ctx: { db, authUser } }) => {
      try {
        const response: any = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=${config.booksApiKey}`
        )

        if (!response.data.items) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Book not found',
          })
        }

        const alreadyExists = await db.getRepository(Book).findOne({
          where: {
            isbn: bookIsbn,
            schoolId: authUser.schoolId,
          },
        })

        if (alreadyExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Book already exists in the library.',
          })
        }

        const book = (await db.getRepository(Book).save({
          title: response.data.items[0].volumeInfo.title,
          authors: response.data.items[0].volumeInfo.authors,
          isbn: bookIsbn,
          publisher: response.data.items[0].volumeInfo.publisher,
          publicationYear: response.data.items[0].volumeInfo.publishedDate,
          description: response.data.items[0].volumeInfo.description,
          coverImageUrl:
            response.data.items[0].volumeInfo.imageLinks.smallThumbnail,
          coverImageLargeUrl:
            response.data.items[0].volumeInfo.imageLinks.thumbnail,
          quantity,
          availableQuantity: quantity,
          schoolId: authUser.schoolId,
        })) as Book
        return book
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error
        }

        throw error
      }
    }
  )
