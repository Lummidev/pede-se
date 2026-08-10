import vine from '@vinejs/vine'

export const OrderPagingQueryStringValidator = vine.create({
  page: vine.number().withoutDecimals().positive().optional(),
})
export const OrderValidator = vine.create({
  products: vine
    .array(
      vine.object({
        amount: vine.number().positive(),
        id: vine.string().uuid().exists({ table: 'products', column: 'id' }),
      })
    )
    .minLength(1)
    .distinct('id'),
})
