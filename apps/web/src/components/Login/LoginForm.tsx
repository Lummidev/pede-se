import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Link from 'next/link'

export interface LoginFields {
  email: string
  password: string
}
const getFields = (element: HTMLFormElement) => {
  const formData = new FormData(element)
  const loginFields: LoginFields = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }
  return loginFields
}
export function LoginForm({
  handleLogin,
  pendingLogin,
  disabled,
}: {
  handleLogin: (fields: LoginFields) => void
  pendingLogin: boolean
  disabled?: boolean
}) {
  const disableInputs = pendingLogin || disabled

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault()
        const fields = getFields(e.target)
        handleLogin(fields)
      }}
    >
      <TextField disabled={disableInputs} label="Email" name="email" />
      <TextField disabled={disableInputs} label="Password" name="password" type="password" />
      <Button
        loading={pendingLogin}
        disabled={disabled}
        variant="contained"
        fullWidth
        type="submit"
      >
        Login
      </Button>
      <Button
        disabled={disableInputs}
        variant="outlined"
        href="/signup"
        LinkComponent={Link}
        fullWidth
      >
        Create account
      </Button>
    </Stack>
  )
}
