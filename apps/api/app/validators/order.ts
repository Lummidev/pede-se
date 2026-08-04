import vine from '@vinejs/vine'

export const OrderPagingQueryStringValidator = vine.create({
  page: vine.number().withoutDecimals().positive().optional(),
})
export const OrderValidator = vine.create({
  items: vine
    .array(
      vine.object({
        amount: vine.number().positive(),
        id: vine.string().uuid().exists({ table: 'items', column: 'id' }),
      })
    )
    .minLength(1)
    .distinct('id'),
})
