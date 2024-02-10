import { router } from '@server/trpc'
import create from './create'
import returned from './returned'

export default router({
  create,
  returned,
})
