import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Book, School, User } from '@server/entities'
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
const bookRepository = db.getRepository(Book)

const { create } = bookRouter.createCaller(authContext({ db }, user))

afterAll(() => {
  db.destroy()
})

it('should create a new book', async () => {
  const fakedBook = fakeBook()

  const result = await create(fakedBook)

  expect(result).toHaveProperty('id')
  expect(result).toHaveProperty('title')
  expect(result).toHaveProperty('authors')
  expect(result).toHaveProperty('isbn')
  expect(result).toHaveProperty('publisher')
  expect(result).toHaveProperty('publicationYear')
  expect(result).toHaveProperty('description')
  expect(result).toHaveProperty('quantity')
  expect(result).toHaveProperty('schoolId')
  expect(result).toHaveProperty('availableQuantity')
  expect(result).toHaveProperty('coverImageUrl')
  expect(result).toHaveProperty('coverImageLargeUrl')
  const savedBook = await bookRepository.findOneOrFail({
    where: {
      id: result.id,
    },
  })

  expect(savedBook.id).toEqual(result.id)
  expect(savedBook.title).toEqual(result.title)
  expect(savedBook.authors).toEqual(result.authors)
  expect(savedBook.isbn).toEqual(result.isbn)
  expect(savedBook.publisher).toEqual(result.publisher)
  expect(savedBook.publicationYear).toEqual(result.publicationYear)
  expect(savedBook.description).toEqual(result.description)
  expect(savedBook.quantity).toEqual(result.quantity)
  expect(savedBook.schoolId).toEqual(result.schoolId)
  expect(savedBook.availableQuantity).toEqual(result.availableQuantity)
  expect(savedBook.coverImageUrl).toEqual(result.coverImageUrl)
  expect(savedBook.coverImageLargeUrl).toEqual(result.coverImageLargeUrl)
})

describe('', async () => {
  it('Should give an trpc error if no book was found', async () => {
    await expect(
      create({
        isbn: '784127841789248791789',
        quantity: 2,
      })
    ).rejects.toThrow(/Book not found/i)
  })
})
