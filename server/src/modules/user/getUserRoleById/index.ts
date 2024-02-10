import { publicProcedure } from '@server/trpc'
import { User, userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(userSchema.shape.id)
  .query(async ({ input: userId, ctx: { db } }) => {
    const user = await db.getRepository(User).findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    // return only the role of the user
    return user.role
  })
