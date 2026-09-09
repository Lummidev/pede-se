'use client'

import useProductPage from '@/hooks/useProductPage'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import AlertTitle from '@mui/material/AlertTitle'
import AddIcon from '@mui/icons-material/Add'
import useStoreInfo from '@/hooks/useStoreInfo'
import Drawer from '@mui/material/Drawer'
import { ProductFields, ProductForm } from '@/components/Menu/ProductForm'
import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import type { Route } from '@tuyau/core/types'
import { useSnackbar } from 'notistack'
export default function Page() {
  const {
    products,
    metadata,
    error: productPageError,
    isLoading: isLoadingProducts,
    mutate,
  } = useProductPage({ page: 1 })
  const { info, isLoading: isLoadingInfo, error: infoError } = useStoreInfo()
  const showSkeleton = isLoadingInfo || isLoadingProducts || !!infoError || !!productPageError
  const onNewProduct = (product: Route.Response<'products.store'>) => {
    mutate.addProduct(product)
  }
  return (
    <Box>
      {productPageError ? (
        <LoadingError
          message="Error loading products"
          details={JSON.stringify(productPageError, undefined, ' ')}
        />
      ) : (
        infoError && (
          <LoadingError
            message="Error loading store information"
            details={JSON.stringify(infoError, undefined, ' ')}
          />
        )
      )}
      {showSkeleton ? (
        <PageSkeleton />
      ) : (
        <Products
          products={products!}
          metadata={metadata!}
          info={info!}
          onNewProduct={onNewProduct}
        />
      )}
    </Box>
  )
}
function LoadingError({ message, details }: { message: string; details: string }) {
  return (
    <Alert variant="filled" severity="warning">
      <AlertTitle>{message}</AlertTitle>
      <code>{details}</code>
    </Alert>
  )
}
function Products({
  products,
  metadata,
  info,
  onNewProduct,
}: {
  products: {
    id: string
    name: string
    description: string | null
    priceCents: number
  }[]
  metadata: { total: string }
  info: { storeName: string }
  onNewProduct: (response: Route.Response<'products.store'>) => unknown
}) {
  const [showNewProductDrawer, setShowNewProductDrawer] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const onProduct = (response: Route.Response<'products.store'>) => {
    enqueueSnackbar({ message: 'Product created successfully', variant: 'success' })
    setShowNewProductDrawer(false)
    onNewProduct(response)
  }
  return (
    <>
      <Stack
        direction={'row'}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">{`${info.storeName}'s Products (${metadata.total})`}</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setShowNewProductDrawer(true)
          }}
          disabled={showNewProductDrawer}
        >
          New product
        </Button>
      </Stack>
      <ProductsTable products={products ?? []} />
      <ProductDrawer
        open={showNewProductDrawer}
        onClose={() => {
          setShowNewProductDrawer(false)
        }}
        onProduct={onProduct}
      />
    </>
  )
}
function ProductsTable({
  products,
}: {
  products: {
    id: string
    name: string
    description: string | null
    priceCents: number
  }[]
}) {
  return (
    <TableContainer component={Box}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell width={'10%'} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{currencyFormat.format(product.priceCents / 100)}</TableCell>
              <TableCell width={'10%'}>
                <Button fullWidth color="primary" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button fullWidth color="error" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function PageSkeleton() {
  const cols = 4
  const rows = 20
  return (
    <>
      <Typography variant="h4">
        <Skeleton component={'span'} width="10rem" />
      </Typography>
      <TableContainer component={Box}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {Array.from({ length: cols }, (_, index) => {
                return (
                  <TableCell key={index}>
                    <Skeleton />
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rows }, (_, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {Array.from({ length: cols }, (_, cellIndex) => {
                    return (
                      <TableCell key={`${rowIndex}-${cellIndex}`}>
                        <Skeleton />
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const currencyFormat = new Intl.NumberFormat(undefined, {
  currency: 'BRL',
  currencySign: 'standard',
  currencyDisplay: 'symbol',
  style: 'currency',
})

const ProductDrawer = ({
  open,
  onClose,
  onProduct,
}: {
  open: boolean
  onClose: () => unknown
  onProduct: (product: Route.Response<'products.store'>) => unknown
}) => {
  const [pendingNewProduct, setPendingNewProduct] = useState(false)
  const [errors, setErrors] = useState<{ field: string; message: string }[] | undefined>()
  const { enqueueSnackbar } = useSnackbar()
  const handleNewProduct = (fields: ProductFields) => {
    setPendingNewProduct(true)
    setErrors(undefined)
    apiClient.api.products
      .store({ body: fields })
      .safe()
      .then(([data, error]) => {
        setPendingNewProduct(false)
        if (data) {
          onProduct(data)
          return
        }
        if (error.isValidationError()) {
          setErrors(error.response.errors)
          return
        }
        if (error.kind === 'network') {
          enqueueSnackbar({
            message:
              'A network error happened while trying to create the product. Check your connection and try again.',
            variant: 'error',
          })
        }
      })
  }
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Stack
        spacing={2}
        sx={{
          padding: '2em',
        }}
      >
        <Typography variant="h4">Create Product</Typography>
        <ProductForm
          onSubmit={handleNewProduct}
          pending={pendingNewProduct}
          onCancel={onClose}
          errors={errors}
        />
      </Stack>
    </Drawer>
  )
}
