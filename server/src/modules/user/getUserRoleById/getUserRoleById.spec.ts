import { User, School } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { TRPCError } from '@trpc/server'
import { fakeUser, fakeSchool } from '@server/entities/tests/fakes'
import userRouter from '..'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const { getUserRoleById } = userRouter.createCaller({ db })

afterAll(() => {
  db.destroy()
})

it('should return the role of the user', async () => {
  const school = await db.getRepository(School).save(fakeSchool())

  const fakedUser = fakeUser()
  fakedUser.schoolId = school.id
  await userRepository.save(fakedUser)

  const result = await getUserRoleById(fakedUser.id)

  expect(result).toBe(fakedUser.role)
})

it('should throw an error if user is not found', async () => {
  const invalidUserId = 999
  await expect(getUserRoleById(invalidUserId)).rejects.toThrow(TRPCError)
})
