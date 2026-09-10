import { useSnackbar } from 'notistack'
import { ProductFields } from './ProductForm'
import { apiClient } from '@/lib/apiClient'
import { useState } from 'react'
import { ProductDrawer } from './ProductDrawer'
import { Route } from '@tuyau/core/types'

export const UpdateProductDrawer = ({
  onProductUpdate,
  open,
  onClose,
  product,
}: {
  onProductUpdate: (product: Route.Response<'products.update'>) => unknown
  open: boolean
  onClose: () => unknown
  product?: { id: string } & ProductFields
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [errors, setErrors] = useState<{ field: string; message: string }[] | undefined>()
  const [pendingProductUpdate, setPendingProductUpdate] = useState(false)

  const handleUpdatedProduct = (fields: ProductFields) => {
    if (!product) return
    setPendingProductUpdate(true)
    setErrors(undefined)
    apiClient.api.products
      .update({ params: { id: product.id }, body: fields })
      .safe()
      .then(([data, error]) => {
        setPendingProductUpdate(false)
        if (data) {
          onProductUpdate(data)
          return
        }
        if (error.isValidationError()) {
          setErrors(error.response.errors)
          return
        }
        if (error.kind === 'network') {
          enqueueSnackbar({
            message:
              'A network error happened while trying to edit the product. Check your connection and try again.',
            variant: 'error',
          })
        }
      })
  }
  return (
    <ProductDrawer
      title="Edit Product"
      handleSubmit={handleUpdatedProduct}
      open={open}
      onClose={onClose}
      pendingSubmit={pendingProductUpdate}
      defaultValues={product}
      errors={errors}
      primaryActionLabel="Save"
    />
  )
}
