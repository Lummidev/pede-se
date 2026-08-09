import type { HttpContext } from '@adonisjs/core/http'

import Setting from '#models/setting'
import SettingTransformer from '#transformers/setting_transformer'

export default class SettingsController {
  async info({ serialize }: HttpContext) {
    return serialize(SettingTransformer.transform(await Setting.firstOrFail()))
  }
}
