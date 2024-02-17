import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { School, User } from '@server/entities'
import { fakeBook, fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import { UserRoles } from '@server/entities/user'
import bookRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const school2 = await db.getRepository(School).save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
  schoolId: school.id,
})
const user2 = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.LIBRARIAN,
  schoolId: school2.id,
})

const { create, get } = bookRouter.createCaller(authContext({ db }, user))
const { create: create2 } = bookRouter.createCaller(authContext({ db }, user2))

afterAll(() => {
  db.destroy()
})

it('should get books only books that are from their school', async () => {
  const fakedBook = fakeBook()

  const result = await create(fakedBook)
  await create2(fakedBook)

  const books = await get({ page: 0 })

  expect(books.length).toEqual(1)
  expect(books[0].id).toEqual(result.id)
  expect(books[0].title).toEqual(result.title)
  expect(books[0].authors).toEqual(result.authors)
  expect(books[0].publisher).toEqual(result.publisher)
  expect(books[0].coverImageUrl).toEqual(result.coverImageUrl)
})
