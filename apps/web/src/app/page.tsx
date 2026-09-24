'use client'
import { LoginFields, LoginForm } from '@/components/Login/LoginForm'
import { LoginInfo } from '@/components/Login/LoginInfo'
import { AuthResult, Auth } from '@/lib/auth'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'

export default function LoginPage() {
  const [pendingLogin, setPendingLogin] = useState(false)
  const [checkingLogin, setCheckingLogin] = useState(true)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleLogin = (fields: LoginFields) => {
    setPendingLogin(true)
    Auth.login(fields).then((result) => {
      setPendingLogin(false)
      switch (result) {
        case AuthResult.Success:
          router.push('/home')
          return
        case AuthResult.InvalidCredentials:
          enqueueSnackbar(authFailMessages.invalidCredentials.message, {
            variant: authFailMessages.invalidCredentials.severity,
          })
          break
        case AuthResult.NetworkError:
          enqueueSnackbar(authFailMessages.networkError.message, {
            variant: authFailMessages.networkError.severity,
          })
          break
        default:
          enqueueSnackbar(authFailMessages.unknownError.message, {
            variant: authFailMessages.unknownError.severity,
          })
      }
    })
  }

  useEffect(() => {
    Auth.check().then((result) => {
      switch (result) {
        case AuthResult.Success:
          router.replace('/home')
          return
        case AuthResult.Unauthorized:
          break
        case AuthResult.InvalidToken:
          enqueueSnackbar(authFailMessages.invalidToken.message, {
            variant: authFailMessages.invalidToken.severity,
          })
          break
        case AuthResult.NetworkError:
          enqueueSnackbar(authFailMessages.networkError.message, {
            variant: authFailMessages.networkError.severity,
          })
          break
        case AuthResult.UnknownError:
          enqueueSnackbar(authFailMessages.unknownError.message, {
            variant: authFailMessages.unknownError.severity,
          })
          break
      }
      setCheckingLogin(false)
    })
  }, [router, enqueueSnackbar])

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Grid
          container
          sx={{
            width: {
              xl: '70%',
              lg: '80%',
              md: '90%',
              xs: '100%',
            },
          }}
        >
          <Grid
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            size={{ xl: 6, lg: 6, xs: 12 }}
          >
            <LoginInfo />
          </Grid>
          <Grid size={{ xl: 6, lg: 6, xs: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '100%',
              }}
            >
              <LoginForm
                handleLogin={handleLogin}
                disabled={checkingLogin}
                pendingLogin={pendingLogin}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const authFailMessages = {
  unauthorized: { message: 'You are logged out.', severity: 'warning' as const },
  invalidToken: {
    message: 'You were logged out. Please login again.',
    severity: 'warning' as const,
  },
  networkError: {
    message:
      'A network error occurred when trying to verify your credentials. Check your connection and try again.',
    severity: 'error' as const,
  },
  unknownError: {
    message: 'Unknown error while verifying your login',
    severity: 'error' as const,
  },
  invalidCredentials: {
    message: 'The inserted email/password combination is not correct.',
    severity: 'error' as const,
  },
}
// const ErrorInfoDialog = (props: { onClose: () => void; open: boolean; errorDetails: string }) => {
//   return (
//     <Dialog onClose={props.onClose} open={props.open}>
//       <DialogTitle>Authentication error</DialogTitle>
//       <DialogContent>
//         <DialogContentText>Error details:</DialogContentText>
//         <Paper sx={{ fontFamily: 'monospace', whiteSpace: 'pre', overflowX: 'auto', p: '1em' }}>
//           <Typography component={'code'}>{props.errorDetails}</Typography>
//         </Paper>
//       </DialogContent>
//     </Dialog>
//   )
// }
