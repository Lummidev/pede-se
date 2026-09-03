import TextField, { TextFieldProps } from '@mui/material/TextField'

export function TextFieldWithErrors({
  name,
  errors,
  textFieldProps,
}: {
  name: string
  errors?: Partial<Record<string, { message: string }[]>>
  textFieldProps: Omit<TextFieldProps, 'error' | 'helperText' | 'name'>
}) {
  const hasError = errors && !!errors[name]
  let helperText: string | undefined
  if (hasError) {
    helperText = errors[name]?.map((error) => error.message).join(' ')
  }
  return (
    <TextField
      name={name}
      error={errors && !!errors[name]}
      helperText={helperText}
      {...textFieldProps}
    />
  )
}
