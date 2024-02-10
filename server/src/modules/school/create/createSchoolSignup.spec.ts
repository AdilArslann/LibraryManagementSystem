import { School, User } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { fakeSchool, fakeUser } from '@server/entities/tests/fakes'
import { omit } from 'lodash'
import { UserRoles } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import schoolRouter from '..'

const db = await createTestDatabase()
const schoolRepository = db.getRepository(School)
const tSchool = await schoolRepository.save(fakeSchool())
const user = await db.getRepository(User).save({
  ...fakeUser(),
  role: UserRoles.ADMIN,
  schoolId: tSchool.id,
})
const user2 = await db.getRepository(User).save({
  ...fakeUser(),
  schoolId: tSchool.id,
})
const { create } = schoolRouter.createCaller(authContext({ db }, user))
const { create: create2 } = schoolRouter.createCaller(
  authContext({ db }, user2)
)
afterAll(() => {
  db.destroy()
})

it('should create a school', async () => {
  const tempSchool = fakeSchool()

  const school = await create(tempSchool)

  const schoolCreated = (await schoolRepository.findOneOrFail({
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
    },
    where: {
      email: tempSchool.email,
    },
  })) as Pick<School, 'id' | 'name' | 'address' | 'phone' | 'email'>

  expect(schoolCreated).toEqual({
    id: expect.any(Number),
    name: tempSchool.name,
    address: tempSchool.address,
    phone: tempSchool.phone,
    email: tempSchool.email,
  })

  expect(omit(school, 'id')).toMatchObject(omit(tempSchool, 'id'))
})

it('should require a valid email', async () => {
  await expect(
    create({
      name: 'school name',
      address: 'school address',
      phone: 'school phone',
      email: 'school-email-invalid',
    })
  ).rejects.toThrow(/email/i)
})

it('shouldnt allow non-admin users to create a school', async () => {
  await expect(create2(fakeSchool())).rejects.toThrow(/access denied/i)
})
