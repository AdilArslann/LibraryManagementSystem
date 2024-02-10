import { Reservation, Book } from '@server/entities'
import { reservationSchema } from '@server/entities/reservation'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(
    reservationSchema.pick({
      bookId: true,
    })
  )
  .mutation(async ({ input: { bookId }, ctx: { db, authUser } }) => {
    const book = await db.getRepository(Book).findOne({
      where: {
        id: bookId,
        schoolId: authUser.schoolId,
      },
    })

    if (!book || book.availableQuantity < 1) {
      throw new Error('Book is not available')
    }
    try {
      const reservation = await db.getRepository(Reservation).save({
        bookId,
        userId: authUser.id,
        expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      book.availableQuantity -= 1
      await db.getRepository(Book).save(book)

      return reservation
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }

      throw error
    }
  })
