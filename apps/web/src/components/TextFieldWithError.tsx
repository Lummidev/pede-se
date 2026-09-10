import TextField, { TextFieldProps } from '@mui/material/TextField'
import { CurrencyInput } from './CurrencyInput'

export function TextFieldWithErrors(
  props: {
    name: string
    validationErrors?: string[]
  } & (
    { inputType?: 'text'; defaultValue?: string } | { inputType: 'currency'; defaultValue?: number }
  ) &
    Omit<TextFieldProps, 'error' | 'helperText' | 'name' | 'defaultValue'>
) {
  const { validationErrors, name, inputType, defaultValue, ...rest } = props
  const helperText = validationErrors?.join(' ')
  if (inputType === 'currency') {
    return (
      <CurrencyInput
        name={name}
        defaultValue={defaultValue}
        error={!!validationErrors}
        helperText={helperText}
        {...rest}
      />
    )
  }
  return (
    <TextField
      name={name}
      defaultValue={defaultValue}
      error={!!validationErrors}
      helperText={helperText}
      {...rest}
    />
  )
}
