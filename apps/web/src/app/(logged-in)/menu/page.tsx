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
import AlertTitle from '@mui/material/AlertTitle'
import useStoreInfo from '@/hooks/useStoreInfo'
export default function Page() {
  const {
    products,
    metadata,
    error: productPageError,
    isLoading: isLoadingProducts,
  } = useProductPage({ page: 1 })
  const { info, isLoading: isLoadingInfo, error: infoError } = useStoreInfo()
  const showSkeleton = isLoadingInfo || isLoadingProducts || !!infoError || !!productPageError
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
        <Products products={products!} metadata={metadata!} info={info!} />
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
}: {
  products: {
    id: string
    name: string
    description: string | null
    priceCents: number
  }[]
  metadata: { total: string }
  info: { storeName: string }
}) {
  return (
    <>
      <Typography variant="h4">{`${info.storeName}'s Products (${metadata.total})`}</Typography>
      <ProductsTable products={products ?? []} />
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
