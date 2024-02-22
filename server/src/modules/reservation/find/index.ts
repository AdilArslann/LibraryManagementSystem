import { Reservation } from '@server/entities'
import type { ReservationShowcase } from '@server/entities/reservation'
import { UserRoles } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db, authUser } }) => {
    let reservations: ReservationShowcase[]
    if (authUser.role === UserRoles.LIBRARIAN) {
      reservations = await db.getRepository(Reservation).find({
        where: {
          user: {
            schoolId: authUser.schoolId,
          },
        },
        relations: ['book', 'user'],
        order: {
          status: 'ASC',
          reservationDate: 'DESC',
        },
      })
    } else {
      reservations = await db.getRepository(Reservation).find({
        where: {
          userId: authUser.id,
        },
        relations: ['book', 'user'],
        order: {
          status: 'ASC',
          reservationDate: 'DESC',
        },
      })
    }

    return reservations
  }
)
