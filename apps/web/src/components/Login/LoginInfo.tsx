'use client'

import useLoginPageInfo from '@/hooks/useLoginPageInfo'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

export function LoginInfo() {
  const { info, error, isLoading } = useLoginPageInfo()
  if (error) return <div>Error: {error.message}</div>
  return (
    <Box>
      <Typography variant="h2" component={'h1'} gutterBottom>
        {isLoading ? <Skeleton variant="text" width={300} /> : info?.storeName}
      </Typography>
      <Typography>{isLoading ? <Skeleton variant="text" /> : info?.welcomeMessage}</Typography>
    </Box>
  )
}
