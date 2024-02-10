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
      })
    } else {
      reservations = await db.getRepository(Reservation).find({
        where: {
          userId: authUser.id,
        },
        relations: ['book', 'user'],
      })
    }

    return reservations.map((reservation) => ({
      id: reservation.id,
      reservationDate: reservation.reservationDate,
      expireDate: reservation.expireDate,
      status: reservation.status,
      book: {
        id: reservation.book.id,
        title: reservation.book.title,
      },
      user: {
        id: reservation.user.id,
        name: reservation.user.name,
      },
    }))
  }
)
