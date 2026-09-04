import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import { TextFieldWithErrors } from '../TextFieldWithError'
export interface SignupFields {
  name: string
  phoneNumber: string
  email: string
  password: string
  passwordConfirmation: string
}
const getFields = (element: HTMLFormElement) => {
  const formData = new FormData(element)
  const loginFields: SignupFields = {
    name: formData.get('name')?.toString() ?? '',
    phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    passwordConfirmation: formData.get('passwordConfirmation')?.toString() ?? '',
  }
  return loginFields
}
export function SignupForm({
  handleSignup,
  pendingSignup,
  disabled,
  errors,
}: {
  handleSignup: (fields: SignupFields) => void
  pendingSignup: boolean
  disabled?: boolean
  errors?: { field: string; message: string }[]
}) {
  const disableInputs = pendingSignup || disabled

  const errorsByField = !errors ? {} : Object.groupBy(errors, (error) => error.field)
  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        const fields = getFields(e.target)
        handleSignup(fields)
      }}
      spacing={2}
    >
      <TextFieldWithErrors
        name="name"
        errors={errorsByField}
        textFieldProps={{
          disabled: disableInputs,
          label: 'Name',
        }}
      />
      <TextFieldWithErrors
        textFieldProps={{
          disabled: disableInputs,
          label: 'Phone Number',
        }}
        name="phoneNumber"
      />
      <TextFieldWithErrors
        textFieldProps={{
          disabled: disableInputs,
          label: 'Email',
        }}
        name="email"
        errors={errorsByField}
      />
      <TextFieldWithErrors
        textFieldProps={{
          disabled: disableInputs,
          label: 'Password',
          type: 'password',
        }}
        name="password"
        errors={errorsByField}
      />
      <TextFieldWithErrors
        textFieldProps={{
          disabled: disableInputs,
          label: 'Password Confirmation',
          type: 'password',
        }}
        name="passwordConfirmation"
        errors={errorsByField}
      />

      <Button
        loading={pendingSignup}
        disabled={disabled}
        fullWidth
        variant="contained"
        type="submit"
      >
        Confirm
      </Button>
      <Button disabled={disableInputs} fullWidth variant="outlined" href="/" LinkComponent={Link}>
        Go back to login
      </Button>
    </Stack>
  )
}
