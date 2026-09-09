import TextField, { TextFieldProps } from '@mui/material/TextField'
import { CurrencyInput } from './CurrencyInput'

export function TextFieldWithErrors(
  props: {
    name: string
    validationErrors?: string[]
    inputType?: 'text' | 'currency'
  } & Omit<TextFieldProps, 'error' | 'helperText' | 'name'>
) {
  const { validationErrors, name, inputType = 'text', ...rest } = props
  const helperText = validationErrors?.join(' ')
  if (inputType === 'currency') {
    return (
      <CurrencyInput name={name} error={!!validationErrors} helperText={helperText} {...rest} />
    )
  }
  return <TextField name={name} error={!!validationErrors} helperText={helperText} {...rest} />
}
