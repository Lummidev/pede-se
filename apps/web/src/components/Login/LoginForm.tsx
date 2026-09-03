'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export function LoginForm({
  handleLogin,
  pendingLogin,
  disabled,
}: {
  handleLogin: (target: HTMLFormElement) => void
  pendingLogin: boolean
  disabled: boolean
}) {
  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin(e.target)
      }}
    >
      <TextField disabled={pendingLogin || disabled} label={'Email'} name="email" />
      <TextField disabled={pendingLogin || disabled} label={'Password'} name="password" />
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          loading={pendingLogin}
          disabled={disabled}
          variant="contained"
          fullWidth
          type="submit"
        >
          Login
        </Button>
      </Box>
      <Button disabled={pendingLogin || disabled} variant="outlined" fullWidth>
        Create account
      </Button>
    </Stack>
  )
}
