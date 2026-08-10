import Product from '#models/product'
import ProductTransformer from '#transformers/product_transformer'
import { productPagingQueryStringValidator, productValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ request, serialize }: HttpContext) {
    const qs = request.qs()

    const { page } = await productPagingQueryStringValidator.validate(qs)
    const perPage = 20
    const products = await Product.query()
      .orderBy('created_at', 'desc')
      .paginate(page ?? 1, perPage)
    return serialize(
      ProductTransformer.paginate(products.all(), products.getMeta()).useVariant('forProductPage')
    )
  }

  async store({ request, serialize }: HttpContext) {
    const data = await request.validateUsing(productValidator)
    const product = await Product.create(data)
    return serialize(ProductTransformer.transform(product).useVariant('forProductPage'))
  }

  async show({ params, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return serialize(ProductTransformer.transform(product).useVariant('forProductPage'))
  }

  async update({ params, request, serialize }: HttpContext) {
    const newProduct = await request.validateUsing(productValidator)
    const product = await Product.findOrFail(params.id)
    return serialize(
      ProductTransformer.transform(await product.merge(newProduct).save()).useVariant(
        'forProductPage'
      )
    )
  }

  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
  }
}
