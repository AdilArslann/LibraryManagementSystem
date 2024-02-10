import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { School, User } from '@server/entities'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import { UserRoles } from '@server/entities/user'
import bookRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
  schoolId: school.id,
})

const { getPageNumber, create } = bookRouter.createCaller(
  authContext({ db }, user)
)

afterAll(() => {
  db.destroy()
})

it('should get the total number of pages', async () => {
  await create(fakeBook())

  const pages = await getPageNumber()

  expect(pages).toEqual(1)
})
