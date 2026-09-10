import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ProductFields, ProductForm } from './ProductForm'

export const ProductDrawer = ({
  open,
  onClose,
  handleSubmit,
  pendingSubmit,
  errors,
  title,
  primaryActionLabel,
  defaultValues,
}: {
  open: boolean
  onClose: () => unknown
  handleSubmit: (fields: ProductFields) => unknown
  pendingSubmit: boolean
  errors?: { field: string; message: string }[]
  title: string
  primaryActionLabel: string
  defaultValues?: ProductFields
}) => {
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Stack
        spacing={2}
        sx={{
          padding: '2em',
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <ProductForm
          onSubmit={handleSubmit}
          pending={pendingSubmit}
          onCancel={onClose}
          errors={errors}
          defaultValues={defaultValues}
          primaryActionLabel={primaryActionLabel}
        />
      </Stack>
    </Drawer>
  )
}
