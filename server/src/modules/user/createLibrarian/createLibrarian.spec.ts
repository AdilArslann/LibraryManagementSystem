import { createTestDatabase } from '@tests/utils/database'
import { User, School } from '@server/entities'
import { fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import { UserRoles } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import usersRouter from '..'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const tSchool = await db.getRepository(School).save(fakeSchool())
const user = await userRepository.save({
  ...fakeUser(),
  role: UserRoles.ADMIN,
  schoolId: tSchool.id,
})
const user2 = await userRepository.save({
  ...fakeUser(),
  schoolId: tSchool.id,
})
afterAll(() => {
  db.destroy()
})

const { createLibrarian } = usersRouter.createCaller(authContext({ db }, user))
const { createLibrarian: createLibrarian2 } = usersRouter.createCaller(
  authContext({ db }, user2)
)

it('should create a librarian', async () => {
  const tempUser = fakeUser()

  const librarian = await createLibrarian({
    ...tempUser,
    schoolId: tSchool.id,
  })

  const librarianCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      schoolId: true,
    },
    where: {
      email: tempUser.email,
    },
  })) as Pick<User, 'id' | 'email' | 'name' | 'role' | 'schoolId'>

  expect(librarianCreated).toEqual({
    id: expect.any(Number),
    email: tempUser.email,
    name: tempUser.name,
    role: UserRoles.LIBRARIAN,
    schoolId: tSchool.id,
  })

  expect(librarian).toEqual({
    id: librarianCreated.id,
    email: tempUser.email,
    name: tempUser.name,
    role: UserRoles.LIBRARIAN,
  })
})

it('should not allow anyone except admins to create librarians', async () => {
  await expect(
    createLibrarian2({
      ...fakeUser(),
      schoolId: tSchool.id,
    })
  ).rejects.toThrowError('Access denied')
})

it('should not allow creating a librarian with an existing email', async () => {
  const tempUser = fakeUser()

  await createLibrarian({
    ...tempUser,
    schoolId: tSchool.id,
  })

  await expect(
    createLibrarian({
      ...tempUser,
      schoolId: tSchool.id,
    })
  ).rejects.toThrowError('User with this email already exists')
})
