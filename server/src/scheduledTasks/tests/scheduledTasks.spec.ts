import { vi, expect } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import updateStatusReservation from '@server/scheduledTasks/updateStatusReservation'
import updateStatusLoan from '@server/scheduledTasks/updateStatusLoan'
import startScheduledTasks from '../index'

const db = await createTestDatabase()

vi.mock('@server/scheduledTasks/updateStatusReservation')
vi.mock('@server/scheduledTasks/updateStatusLoan')

it('', async () => {
  await startScheduledTasks(db)

  expect(updateStatusReservation).toHaveBeenCalled()
  expect(updateStatusReservation).toHaveBeenCalledWith(db)
  expect(updateStatusLoan).toHaveBeenCalled()
  expect(updateStatusLoan).toHaveBeenCalledWith(db)
})
