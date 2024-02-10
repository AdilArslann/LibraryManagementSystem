import { Loan, Reservation } from '@server/entities'
import { loanSchema } from '@server/entities/loan'
import { Status } from '@server/entities/reservation'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    loanSchema.pick({
      reservationId: true,
    })
  )
  .mutation(async ({ input: { reservationId }, ctx: { db } }) => {
    const reservation = await db.getRepository(Reservation).findOne({
      where: {
        id: reservationId,
      },
    })

    if (!reservation) {
      throw new TRPCError({
        message: 'There is no prior reservation',
        code: 'NOT_FOUND',
      })
    }

    const loan = await db.getRepository(Loan).save({
      checkoutDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      userId: reservation.userId,
      bookId: reservation.bookId,
      reservationId: reservation.id,
    })

    reservation.status = Status.COMPLETED
    await db.getRepository(Reservation).save(reservation)

    return loan
  })
