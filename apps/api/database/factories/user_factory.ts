import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number({ style: 'international' }),
      password: faker.internet.password(),
      email: faker.internet.email(),
    }
  })
  .build()
