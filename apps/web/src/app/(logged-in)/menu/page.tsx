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
import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import type { Route } from '@tuyau/core/types'
import { useSnackbar } from 'notistack'
import { NewProductDrawer } from '@/components/Menu/NewProductDrawer'
import { UpdateProductDrawer } from '@/components/Menu/UpdateProductDrawer'
import { ProductFields } from '@/components/Menu/ProductForm'
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
  const onUpdateProduct = (product: Route.Response<'products.store'>) => {
    mutate.updateProduct(product)
  }
  const onDeleteProduct = (id: string) => {
    mutate.deleteProduct(id)
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
          onDelete={onDeleteProduct}
          onUpdateProduct={onUpdateProduct}
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
  onDelete,
  onUpdateProduct,
}: {
  products: {
    id: string
    name: string
    description?: string | null
    priceCents: number
  }[]
  metadata: { total: string }
  info: { storeName: string }
  onNewProduct: (response: Route.Response<'products.store'>) => unknown
  onUpdateProduct: (response: Route.Response<'products.store'>) => unknown

  onDelete: (id: string) => unknown
}) {
  const [showNewProductDrawer, setShowNewProductDrawer] = useState(false)
  const [showUpdateProductDrawer, setShowUpdateProductDrawer] = useState(false)
  const [editingProduct, setEditingProduct] = useState<
    ({ id: string } & ProductFields) | undefined
  >()
  const [disableTableActions, setDisableTableActions] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const handleNewProduct = (response: Route.Response<'products.store'>) => {
    enqueueSnackbar({ message: 'Product created successfully', variant: 'success' })
    setShowNewProductDrawer(false)
    onNewProduct(response)
  }
  const handleProductUpdate = (response: Route.Response<'products.update'>) => {
    enqueueSnackbar({ message: 'Product updated successfully', variant: 'success' })
    setShowUpdateProductDrawer(false)
    onUpdateProduct(response)
  }
  const onDeleteClick = (id: string) => {
    setDisableTableActions(true)
    // TODO: show confirmation before deletion
    apiClient.api.products
      .destroy({ params: { id } })
      .safe()
      .then(([, error]) => {
        if (error) {
          if (error.kind === 'network') {
            enqueueSnackbar({
              message:
                'Could not delete the product due to a network error. Check your connection and try again.',
              variant: 'error',
            })
            return
          }
          enqueueSnackbar({
            variant: 'error',
            message: `Could not delete the product: ${error?.message}`,
          })
        } else {
          onDelete(id)
        }
      })
      .finally(() => setDisableTableActions(false))
  }
  const onUpdateClick = (product: { id: string } & ProductFields) => {
    setEditingProduct(product)
    setShowUpdateProductDrawer(true)
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
      <ProductsTable
        products={products ?? []}
        onDeleteClick={onDeleteClick}
        onUpdateClick={onUpdateClick}
        disableActions={disableTableActions}
      />
      <NewProductDrawer
        open={showNewProductDrawer}
        onClose={() => {
          setShowNewProductDrawer(false)
        }}
        onProductCreation={handleNewProduct}
      />
      <UpdateProductDrawer
        open={showUpdateProductDrawer}
        onClose={() => {
          setShowUpdateProductDrawer(false)
        }}
        product={editingProduct}
        onProductUpdate={handleProductUpdate}
      />
    </>
  )
}
function ProductsTable({
  products,
  onDeleteClick,
  onUpdateClick,
  disableActions,
}: {
  products: {
    id: string
    name: string
    description?: string | null
    priceCents: number
  }[]
  onDeleteClick: (id: string) => unknown
  onUpdateClick: (product: { id: string } & ProductFields) => unknown
  disableActions: boolean
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
                <Button
                  disabled={disableActions}
                  fullWidth
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => onUpdateClick(product)}
                >
                  Edit
                </Button>
                <Button
                  disabled={disableActions}
                  fullWidth
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDeleteClick(product.id)}
                >
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
