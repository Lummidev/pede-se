import { useSnackbar } from 'notistack'
import { ProductFields } from './ProductForm'
import { apiClient } from '@/lib/apiClient'
import { useState } from 'react'
import { ProductDrawer } from './ProductDrawer'
import { Route } from '@tuyau/core/types'

export const NewProductDrawer = ({
  onProductCreation,
  open,
  onClose,
}: {
  onProductCreation: (product: Route.Response<'products.store'>) => unknown
  open: boolean
  onClose: () => unknown
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [errors, setErrors] = useState<{ field: string; message: string }[] | undefined>()
  const [pendingNewProduct, setPendingNewProduct] = useState(false)

  const handleNewProduct = (fields: ProductFields) => {
    setPendingNewProduct(true)
    setErrors(undefined)
    apiClient.api.products
      .store({ body: fields })
      .safe()
      .then(([data, error]) => {
        setPendingNewProduct(false)
        if (data) {
          onProductCreation(data)
          return
        }
        if (error.isValidationError()) {
          setErrors(error.response.errors)
          return
        }
        if (error.kind === 'network') {
          enqueueSnackbar({
            message:
              'A network error happened while trying to create the product. Check your connection and try again.',
            variant: 'error',
          })
        }
      })
  }
  return (
    <ProductDrawer
      title="Create Product"
      handleSubmit={handleNewProduct}
      open={open}
      onClose={onClose}
      pendingSubmit={pendingNewProduct}
      errors={errors}
      primaryActionLabel="Create"
    />
  )
}
