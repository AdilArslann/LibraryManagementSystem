import type { AuthUser } from '@server/entities/user'
import z from 'zod'
import { UserRoles } from '@server/entities/user'

// We have move out the token payload logic into a separate file.
// As we would like to keep both sides of token handling in one place.

const tokenPayloadSchema = z.object({
  user: z.object({
    id: z.number(),
    schoolId: z.number(),
    role: z.enum([UserRoles.STUDENT, UserRoles.LIBRARIAN, UserRoles.ADMIN]),
  }),
})

type TokenPayload = z.infer<typeof tokenPayloadSchema>

/**
 * Prepares the token payload for the given user.
 * @param user The authenticated user.
 * @returns The token payload containing the user information.
 */
export function prepareTokenPayload(user: AuthUser): TokenPayload {
  return tokenPayloadSchema.parse({ user })
}

/**
 * Parses the payload of a verified JWT token.
 * @param tokenVerified - The verified JWT token.
 * @returns The parsed token payload.
 */
export function parseTokenPayload(tokenVerified: unknown): TokenPayload {
  return tokenPayloadSchema.parse(tokenVerified)
}
