import { BaseTransformer } from '@adonisjs/core/transformers'
import type Setting from '#models/setting'

export default class SettingTransformer extends BaseTransformer<Setting> {
  toObject() {
    return this.resource.toAttributes()
  }
}
