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

const { create, find } = bookRouter.createCaller(authContext({ db }, user))
const { create: create2 } = bookRouter.createCaller(authContext({ db }, user2))

afterAll(() => {
  db.destroy()
})

describe('should get books only books that are from their school', async () => {
  const fakedBook = fakeBook()

  const result = await create(fakedBook)
  await create({ ...fakeBook(), isbn: '9781338280098' })

  await create2(fakedBook)

  it('The exact title', async () => {
    const books = await find({ title: 'Fantastic Mr. Fox' })

    expect(books.length).toEqual(1)
    expect(books[0].id).toEqual(result.id)
    expect(books[0].title).toEqual(result.title)
    expect(books[0].authors).toEqual(result.authors)
    expect(books[0].isbn).toEqual(result.isbn)
    expect(books[0].publisher).toEqual(result.publisher)
    expect(books[0].publicationYear).toEqual(result.publicationYear)
    expect(books[0].description).toEqual(result.description)
    expect(books[0].quantity).toEqual(result.quantity)
    expect(books[0].schoolId).toEqual(result.schoolId)
  })

  it('The exact title in different case', async () => {
    const books = await find({ title: 'fAnTasTIc Mr. FoX' })

    expect(books.length).toEqual(1)
    expect(books[0].id).toEqual(result.id)
    expect(books[0].title).toEqual(result.title)
    expect(books[0].authors).toEqual(result.authors)
    expect(books[0].isbn).toEqual(result.isbn)
    expect(books[0].publisher).toEqual(result.publisher)
    expect(books[0].publicationYear).toEqual(result.publicationYear)
    expect(books[0].description).toEqual(result.description)
    expect(books[0].quantity).toEqual(result.quantity)
    expect(books[0].schoolId).toEqual(result.schoolId)
  })

  it('The partial title', async () => {
    const books = await find({ title: 'fantastic' })

    expect(books.length).toEqual(1)
    expect(books[0].id).toEqual(result.id)
    expect(books[0].title).toEqual(result.title)
    expect(books[0].authors).toEqual(result.authors)
    expect(books[0].isbn).toEqual(result.isbn)
    expect(books[0].publisher).toEqual(result.publisher)
    expect(books[0].publicationYear).toEqual(result.publicationYear)
    expect(books[0].description).toEqual(result.description)
    expect(books[0].quantity).toEqual(result.quantity)
    expect(books[0].schoolId).toEqual(result.schoolId)
  })
})
