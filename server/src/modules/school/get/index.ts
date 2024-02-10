import { School } from '@server/entities/school'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const schools = await db.getRepository(School).find()

  // return only the id, name and address of schools for listing them in the signup page
  return schools.map((school) => ({
    id: school.id,
    name: school.name,
    address: school.address,
  }))
})
