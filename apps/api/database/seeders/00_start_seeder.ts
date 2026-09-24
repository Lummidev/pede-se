import Role from '#models/role'
import Setting from '#models/setting'
import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
export default class extends BaseSeeder {
  async run() {
    const defaultStoreName = 'Pede-se Store'
    await Setting.updateOrCreate(
      { storeName: defaultStoreName },
      {
        storeName: defaultStoreName,
        currency: 'BRL',
      }
    )
    const [, adminRole] = await Role.fetchOrCreateMany('name', [
      { name: 'operator' },
      { name: 'admin' },
    ])
    const defaultAdminName = env.get('DEFAULT_ADMIN_NAME', 'Admin')
    await User.updateOrCreate(
      { name: defaultAdminName },
      {
        name: defaultAdminName,
        email: env.get('DEFAULT_ADMIN_EMAIL', 'pedeseadmin@pedese.admin'),
        password: env.get('DEFAULT_ADMIN_PASSWORD', 'admin'),
        phoneNumber: '1',
        roleId: adminRole.id,
      }
    )
  }
}
