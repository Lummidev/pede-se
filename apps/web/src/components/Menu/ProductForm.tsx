import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { TextFieldWithErrors } from '../TextFieldWithError'
import { groupErrorMessages } from '@/lib/util/formErrors'

export interface ProductFields {
  name: string
  description?: string
  priceCents: number
}
const getFields = (formData: FormData) => {
  const loginFields: ProductFields = {
    name: formData.get('name')?.toString() ?? '',
    description: formData.get('description')?.toString().trim() ?? undefined,
    priceCents: Number(formData.get('price')?.toString()),
  }
  return loginFields
}

export const ProductForm = ({
  onSubmit,
  onCancel,
  pending,
  errors,
}: {
  onSubmit: (data: ProductFields) => unknown
  onCancel: () => unknown
  pending: boolean
  errors?: { field: string; message: string }[]
}) => {
  const validationErrors = errors && groupErrorMessages(errors)
  return (
    <Box>
      <Stack
        component={'form'}
        spacing={2}
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.target)
          onSubmit(getFields(data))
        }}
      >
        <TextFieldWithErrors
          label="Name"
          disabled={pending}
          name="name"
          validationErrors={validationErrors?.name}
        />
        <TextFieldWithErrors
          multiline
          disabled={pending}
          label="Description"
          name="description"
          minRows={3}
          validationErrors={validationErrors?.description}
        />
        <TextFieldWithErrors
          inputType="currency"
          disabled={pending}
          label="Price"
          name="price"
          validationErrors={validationErrors?.priceCents}
        />
        <Stack direction={'row'} spacing={1}>
          <Button fullWidth disabled={pending} variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" loading={pending} type="submit">
            Create
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
