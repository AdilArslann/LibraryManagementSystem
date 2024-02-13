import { Reservation, Book } from '@server/entities'
import { reservationSchema, Status } from '@server/entities/reservation'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    reservationSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    const reservation = await db.getRepository(Reservation).findOne({
      where: {
        id: input.id,
        userId: authUser.id,
      },
    })

    if (!reservation) {
      throw new TRPCError({
        message: 'No reservation found to cancel',
        code: 'NOT_FOUND',
      })
    }

    const book = await db.getRepository(Book).findOne({
      where: {
        id: reservation.bookId,
        schoolId: authUser.schoolId,
      },
    })

    if (!book) {
      throw new TRPCError({
        message:
          'There was a problem with finding the book to cancel the reservation',
        code: 'NOT_FOUND',
      })
    }
    reservation.status = Status.CANCELLED
    book.availableQuantity += 1
    await db.getRepository(Reservation).save(reservation)
    await db.getRepository(Book).save(book)

    return reservation
  })
