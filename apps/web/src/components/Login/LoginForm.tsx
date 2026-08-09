'use client'

import useLoginPageInfo from '@/hooks/useLoginPageInfo'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export function LoginForm() {
  const { error } = useLoginPageInfo()
  const disabled = !!error

  return (
    <Stack component="form" spacing={2}>
      <TextField disabled={disabled} label={'Email'} />
      <TextField disabled={disabled} label={'Password'} />
      <Button disabled={disabled} variant="contained" fullWidth type="submit">
        Login
      </Button>
      <Button disabled={disabled} variant="outlined" fullWidth>
        Create account
      </Button>
    </Stack>
  )
}
