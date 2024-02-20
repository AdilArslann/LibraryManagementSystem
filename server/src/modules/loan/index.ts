import { router } from '@server/trpc'
import create from './create'
import returned from './returned'
import get from './get'

export default router({
  get,
  create,
  returned,
})
