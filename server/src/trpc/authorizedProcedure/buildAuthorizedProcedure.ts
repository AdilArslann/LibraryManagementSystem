import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '../authenticatedProcedure'

export function buildAuthorizedProcedure(allowedRoles: string[]) {
  return authenticatedProcedure.use(async ({ ctx, next }) => {
    if (!allowedRoles.includes(ctx.authUser.role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied.' })
    }

    return next()
  })
}
