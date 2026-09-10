import { beforeCreate } from '@adonisjs/lucid/orm'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

/**
 * Mixin to automatically generate a UUID for the primary key of the table.
 * Assumes the primary key field is `id`.
 */

export const WithPrimaryUuid = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class WithPrimaryUuidClass extends superclass {
    static selfAssignPrimaryKey = true

    @beforeCreate()
    static generateId(model: any) {
      model.id = crypto.randomUUID()
    }
  }
  return WithPrimaryUuidClass
}
