'use client'

import useStoreInfo from '@/hooks/useStoreInfo'
import { apiClient } from '@/lib/apiClient'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export function LoginForm({
  handleLogin,
  pendingLogin,
}: {
  handleLogin: (target: HTMLFormElement) => void
  pendingLogin: boolean
}) {
  const { error } = useStoreInfo()

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin(e.target)
      }}
    >
      <TextField disabled={pendingLogin} label={'Email'} name="email" />
      <TextField disabled={pendingLogin} label={'Password'} name="password" />
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button disabled={pendingLogin} variant="contained" fullWidth type="submit">
          Login
        </Button>
        {pendingLogin && (
          <CircularProgress
            aria-label="Loading…"
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      <Button disabled={pendingLogin} variant="outlined" fullWidth>
        Create account
      </Button>
    </Stack>
  )
}
