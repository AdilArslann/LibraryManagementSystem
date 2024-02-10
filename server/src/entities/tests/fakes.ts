import type { User } from '@server/entities/user'
import type { School } from '@server/entities/school'
import type { Book } from '@server/entities/book'
import { random } from '@tests/utils/random'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  name: random.string(),
  role: 'student',
  schoolId: 1,
  ...overrides,
})

export const fakeSchool = <T extends Partial<School>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: random.string(),
  address: random.string(),
  phone: random.string(),
  email: random.email(),
  ...overrides,
})

export const fakeBook = <T extends Partial<Book>>(overrides: T = {} as T) => ({
  isbn: '9780140328721',
  quantity: random.integer({ min: 1, max: 100 }),
  ...overrides,
})
