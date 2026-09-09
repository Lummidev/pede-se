import { apiClient } from '@/lib/apiClient'
import useSWR from 'swr'
import type { Route } from '@tuyau/core/types'

const fetcher = (_key: string, page: number) =>
  apiClient.api.products.index({ query: { page } }).safe()

export default function useProductPage(page: { page: number }) {
  const { data: response, isLoading, mutate } = useSWR(['productPage', page], fetcher)
  const [data, error] = response ? response : [undefined, undefined]
  const mutateProducts = (
    response: Route.Response<'products.store'> | Route.Response<'products.update'>
  ) => {
    mutate((staleState) => {
      if (!staleState) return
      const [staleData, staleError] = staleState
      if (staleData) {
        const filteredProducts = staleData.data.filter((product) => product.id !== response.data.id)
        return [
          { data: [response.data, ...filteredProducts], metadata: staleData.metadata },
          staleError,
        ]
      } else {
        return [staleData, staleError]
      }
    })
  }
  const addProduct = (product: Route.Response<'products.store'>) => {
    mutateProducts(product)
  }
  const updateProduct = (product: Route.Response<'products.store'>) => {
    mutateProducts(product)
  }
  const deleteProduct = (id: string) => {
    mutate((staleState) => {
      if (!staleState) return
      const [staleData, staleError] = staleState
      if (staleData) {
        const filteredProducts = staleData.data.filter((product) => product.id !== id)
        return [{ data: filteredProducts, metadata: staleData.metadata }, staleError]
      } else {
        return [staleData, staleError]
      }
    })
  }
  return {
    products: data?.data,
    metadata: data?.metadata,
    error,
    isLoading,
    mutate: {
      addProduct,
      updateProduct,
      deleteProduct,
    },
  }
}
