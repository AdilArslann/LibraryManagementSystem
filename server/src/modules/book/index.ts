import { router } from '@server/trpc'
import create from './create'
import get from './get'
import find from './find'
import getOne from './getOne'
import getPageNumber from './getPageNumber'

export default router({
  create,
  get,
  find,
  getOne,
  getPageNumber,
})
