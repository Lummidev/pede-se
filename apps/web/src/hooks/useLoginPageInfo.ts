import { apiClient } from '@/lib/apiClient'
import useSWR from 'swr'

const fetcher = () => apiClient.api.settings.info({}).then((data) => data.data)

export default function useLoginPageInfo() {
  const { data, isLoading, error, isValidating } = useSWR('loginInfo', fetcher)
  return {
    info: data,
    isLoading,
    error,
    isValidating,
  }
}
