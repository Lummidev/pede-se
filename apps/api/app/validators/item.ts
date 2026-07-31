import vine from '@vinejs/vine'

export const itemValidator = vine.create({
  name: vine.string().trim().maxLength(255).minLength(1),
  description: vine.string().minLength(8).optional(),
  priceCents: vine.number().withoutDecimals().nonNegative(),
})
export const ItemPagingQueryStringValidator = vine.create({
  page: vine.number().withoutDecimals().positive().optional(),
})
