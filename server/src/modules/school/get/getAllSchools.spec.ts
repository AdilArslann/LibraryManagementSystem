import { School } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { fakeSchool } from '@server/entities/tests/fakes'
import schoolRouter from '..'

const db = await createTestDatabase()
const schoolRepository = db.getRepository(School)
const { get } = schoolRouter.createCaller({ db })

afterAll(() => {
  db.destroy()
})

it('should return all schools with id, name, and address', async () => {
  const fakeSchools = [fakeSchool(), fakeSchool(), fakeSchool()]
  await schoolRepository.save(fakeSchools)

  const result = await get()

  expect(result.length).toBeGreaterThanOrEqual(fakeSchools.length)
  result.forEach((school) => {
    expect(school).toHaveProperty('id')
    expect(school).toHaveProperty('name')
    expect(school).toHaveProperty('address')
    expect(school).not.toHaveProperty('phone')
    expect(school).not.toHaveProperty('email')
  })
})
