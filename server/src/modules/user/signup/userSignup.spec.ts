import { createTestDatabase } from '@tests/utils/database'
import { User, School } from '@server/entities'
import { fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import usersRouter from '..'

const db = await createTestDatabase()
const school = await db.getRepository(School).save(fakeSchool())
const userRepository = db.getRepository(User)
const { signup } = usersRouter.createCaller({ db })

afterAll(() => {
  db.destroy()
})

it('should save a user', async () => {
  const user = { ...fakeUser(), schoolId: school.id }
  const response = await signup(user)

  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
    name: user.name,
    role: user.role,
  })

  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      schoolId: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password' | 'name' | 'role' | 'schoolId'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
    name: user.name,
    role: user.role,
    schoolId: school.id,
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response.id).toEqual(userCreated!.id)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      email: 'user-email-invalid',
      password: 'password.123',
      name: 'User Name',
      schoolId: 1,
    })
  ).rejects.toThrow(/email/i) // throws out some error complaining about "email"
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup({
      email: 'user2@domain.com',
      password: 'pas.123',
      name: 'User Name',
      schoolId: 1,
    })
  ).rejects.toThrow(/password/i) // throws out some error complaining about "password"
})

it('throws an error for invalid email', async () => {
  await expect(
    signup({
      email: 'not-an-email',
      password: 'some-password',
      name: 'User Name',
      schoolId: 1,
    })
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = { ...fakeUser(), schoolId: school.id }
  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})

it('stores email with trimmed whitespace', async () => {
  const user = { ...fakeUser(), schoolId: school.id }
  await signup({
    ...user,
    email: ` \t ${user.email}\t `, // tabs and spaces
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
