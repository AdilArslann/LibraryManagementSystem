import { router } from '../trpc'
import school from './school'
import user from './user'
import book from './book'
import reservation from './reservation'
import loan from './loan'

export const appRouter = router({
  user,
  school,
  book,
  reservation,
  loan,
})

export type AppRouter = typeof appRouter
