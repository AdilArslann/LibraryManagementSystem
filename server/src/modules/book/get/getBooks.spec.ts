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

const fakedBook = fakeBook()

const result = await create(fakedBook)
await create2(fakedBook)

it('should get books only books that are from their school', async () => {
  const books = await get({ page: 0 })

  expect(books.length).toEqual(1)
  expect(books[0].id).toEqual(result.id)
  expect(books[0].title).toEqual(result.title)
  expect(books[0].authors).toEqual(result.authors)
  expect(books[0].publisher).toEqual(result.publisher)
  expect(books[0].coverImageUrl).toEqual(result.coverImageUrl)
})
/*
it('should get books with the specified publisher', async () => {
  const fakedBook = fakeBook()

  const result = await create({ ...fakedBook, isbn: '9780967851464' })

  const books = await get({ page: 0, publishers: [result.publisher] })

  expect(
    books.every((book) => book.publisher === result.publisher)
  ).toBeTruthy()
})

it('should get books with the specified authors', async () => {
  const fakedBook = fakeBook()

  const result = await create({ ...fakedBook, isbn: '9780967851464' })

  const books = await get({ page: 0, authors: result.authors })

 // chekcking that every book that is given back has at least one 
 // author that is matching with our initial author filter since our books
 // have an array for authors and one book can have more than one 
 // author, some will return true as long as one or more returns true 
  
  expect(
    books.every((book) =>
      book.authors.some((author) => result.authors.includes(author))
    )
  ).toBeTruthy()
})

*/
it('should get books with the specified search', async () => {
  const books = await get({ page: 0, title: result.title })

  expect(books[0].title).toEqual(result.title)
  expect(books[0].authors).toEqual(result.authors)
  expect(books[0].publisher).toEqual(result.publisher)
  expect(books[0].coverImageUrl).toEqual(result.coverImageUrl)
})
