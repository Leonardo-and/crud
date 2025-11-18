import { faker } from '@faker-js/faker/locale/pt_BR'
import { User } from '../models/user.js'

async function seedDb() {
  await User.destroy({
    where: {}
  })

  for (let i = 0; i <= 20; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const user = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      birth: faker.date.birthdate()
    }

    await User.create(user)
  }
}

seedDb()
