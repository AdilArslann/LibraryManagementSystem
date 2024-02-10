import { Reservation } from '@server/entities'
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

    reservation.status = Status.CANCELLED

    await db.getRepository(Reservation).save(reservation)

    return reservation
  })
