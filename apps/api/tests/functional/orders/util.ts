import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { Assert } from '@japa/assert'

export async function assertNoModelChange(assert: Assert, model: LucidModel, expected: LucidRow) {
  const actual = await model.findOrFail(expected.$primaryKeyValue)
  assert.deepEqual(actual.toAttributes(), expected.toAttributes())
}
