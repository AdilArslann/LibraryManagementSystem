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

const { create, getOne } = bookRouter.createCaller(authContext({ db }, user))

afterAll(() => {
  db.destroy()
})

it('should return a book', async () => {
  const fakedBook = fakeBook()

  const result = await create(fakedBook)

  const book = await getOne(result.id)

  expect(book.id).toEqual(result.id)
  expect(book.title).toEqual(result.title)
  expect(book.authors).toEqual(result.authors)
  expect(book.coverImageUrl).toEqual(result.coverImageUrl)
  expect(book.isbn).toEqual(result.isbn)
  expect(book.publisher).toEqual(result.publisher)
  expect(book.publicationYear).toEqual(result.publicationYear)
  expect(book.description).toEqual(result.description)
  expect(book.quantity).toEqual(result.quantity)
  expect(book.availableQuantity).toEqual(result.availableQuantity)
})
