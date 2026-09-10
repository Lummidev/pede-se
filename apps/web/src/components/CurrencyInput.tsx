import InputAdornment from '@mui/material/InputAdornment'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { KeyboardEventHandler, useState } from 'react'

const formatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const CurrencyInput = (
  props: {
    name: string
    defaultValue?: number
  } & Omit<TextFieldProps, 'name' | 'value' | 'defaultValue'>
) => {
  const { name, disabled, label, slotProps, onKeyDown, defaultValue, ...rest } = props
  const [cents, setCents] = useState(defaultValue ?? 0)
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Backspace') {
      setCents((prev) => Math.floor(prev / 10))
    } else if (/^[0-9]$/.test(event.key)) {
      setCents((prev) => {
        const newValue = prev * 10 + parseInt(event.key)
        return newValue < 100_000_000_000 ? newValue : prev
      })
    }
    if (onKeyDown) onKeyDown(event)
  }
  const formatted = formatter.format(cents / 100)
  return (
    <>
      <input type="hidden" name={name} value={cents} disabled={disabled} />
      <TextField
        label={label}
        disabled={disabled}
        name={`${name}-formatted-display`}
        value={formatted}
        onKeyDown={handleKeyDown}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          },
        }}
        {...rest}
      />
    </>
  )
}
