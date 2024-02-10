import { UserRoles } from '@server/entities/user'
import { buildAuthorizedProcedure } from './buildAuthorizedProcedure'

export const adminAuthorizedProcedure = buildAuthorizedProcedure([
  UserRoles.ADMIN,
])
export const librarianAuthorizedProcedure = buildAuthorizedProcedure([
  UserRoles.LIBRARIAN,
])
export const bothAuthorizedProcedure = buildAuthorizedProcedure([
  UserRoles.ADMIN,
  UserRoles.LIBRARIAN,
])
