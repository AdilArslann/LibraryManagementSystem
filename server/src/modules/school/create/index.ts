import { adminAuthorizedProcedure } from '@server/trpc/authorizedProcedure'
import { School } from '@server/entities'
import { schoolSchema } from '@server/entities/school'
import { TRPCError } from '@trpc/server'

export default adminAuthorizedProcedure
  .input(
    schoolSchema.pick({
      name: true,
      address: true,
      phone: true,
      email: true,
    })
  )
  .mutation(async ({ input: { name, address, phone, email }, ctx: { db } }) => {
    try {
      const school = await db.getRepository(School).save({
        name,
        address,
        phone,
        email,
      })

      return school
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }

      if (error.message.includes('duplicate key')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'School with this email already exists',
        })
      }

      throw error
    }
  })
