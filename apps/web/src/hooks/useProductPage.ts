import { apiClient } from '@/lib/apiClient'
import useSWR from 'swr'

const fetcher = (_key: string, page: number) =>
  apiClient.api.products.index({ query: { page } }).safe()
export default function useProductPage(page: { page: number }) {
  const { data: response, isLoading } = useSWR(['productPage', page], fetcher)

  const [data, error] = response ? response : [undefined, undefined]

  return {
    products: data?.data,
    metadata: data?.metadata,
    error,
    isLoading,
  }
}
