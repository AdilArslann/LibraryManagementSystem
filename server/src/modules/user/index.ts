import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import getUserRoleById from './getUserRoleById'
import createLibrarian from './createLibrarian'

export default router({
  login,
  signup,
  getUserRoleById,
  createLibrarian,
})
