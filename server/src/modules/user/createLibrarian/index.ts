import bcrypt from 'bcrypt'
import { User } from '@server/entities'
import config from '@server/config'
import { userSchema, UserRoles } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { adminAuthorizedProcedure } from '@server/trpc/authorizedProcedure'

export default adminAuthorizedProcedure
  .input(
    userSchema.pick({
      email: true,
      password: true,
      name: true,
      schoolId: true,
    })
  )
  .mutation(
    async ({ input: { email, password, name, schoolId }, ctx: { db } }) => {
      const hash = await bcrypt.hash(password, config.auth.passwordCost)

      try {
        const user = await db.getRepository(User).save({
          email,
          password: hash,
          name,
          schoolId,
          role: UserRoles.LIBRARIAN,
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error
        }

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
          })
        }

        throw error
      }
    }
  )
