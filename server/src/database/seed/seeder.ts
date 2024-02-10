import { UserRoles } from '@server/entities/user'
import { createDatabase } from '../index'
import config from '../../config'
import { User, School } from '../../entities'

const database = createDatabase(config.database)

database.initialize().then(async () => {
  await seedDatabase()
})

async function seedDatabase() {
  /*
  This is not the best way to seed the database, but due to time constraints and ease of
  implementation, i have decided to go with this approach. 
  */
  let school = await database
    .getRepository(School)
    .findOne({ where: { email: 'valid@email.com' } })

  if (!school) {
    school = await database.getRepository(School).save({
      name: 'Admin School',
      address: '123 Admin St',
      phone: '123-456-7890',
      email: 'valid@email.com',
    })
  }

  let user = await database
    .getRepository(User)
    .findOne({ where: { email: 'admin@gmail.com' } })

  if (!user) {
    user = await database.getRepository(User).save({
      name: 'AdminUser',
      email: 'admin@gmail.com',
      password: '$2b$06$QPFInfuaEcjIIBF48d6YmeoHth4NReOKhKm0YBt3AsUI4emwkItoi',
      role: UserRoles.ADMIN,
      schoolId: school.id,
    })
  }
}
