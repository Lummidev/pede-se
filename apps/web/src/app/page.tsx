'use client'
import { LoginFields, LoginForm } from '@/components/Login/LoginForm'
import { LoginInfo } from '@/components/Login/LoginInfo'
import { apiClient } from '@/lib/apiClient'
import { AuthCheck, checkAuth } from '@/lib/auth'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import { DialogContent, DialogContentText, Typography } from '@mui/material'
import { TuyauError } from '@tuyau/core/client'
const getErrorDetails = (error: TuyauError) => {
  const { name, kind, message, cause } = error
  return JSON.stringify({ name, kind, message, cause }, undefined, ' ')
}
export default function LoginPage() {
  const [pendingLogin, setPendingLogin] = useState(false)
  const [checkingLogin, setCheckingLogin] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [showError, setShowError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | undefined>()
  const showErrorAction = () => {
    return (
      <Button
        onClick={() => {
          setShowError(true)
        }}
        color="inherit"
      >
        Show Details
      </Button>
    )
  }
  const handleLogin = (fields: LoginFields) => {
    setErrorDetails(undefined)
    const loginData = {
      body: fields,
    }
    setPendingLogin(true)
    apiClient.api.auth.accessTokens
      .store(loginData)
      .safe()
      .then(([data, error]) => {
        if (data) {
          localStorage.setItem('token', data.data.token)
          router.push('/home')
          return
        }
        if (error.isValidationError() || error.isStatus(400)) {
          enqueueSnackbar(authFailMessages.invalidCredentials.message, {
            variant: authFailMessages.invalidCredentials.severity,
          })
          return
        }
        if (error.kind === 'network') {
          enqueueSnackbar(authFailMessages.networkError.message, {
            variant: authFailMessages.networkError.severity,
          })
          return
        }
        setErrorDetails(getErrorDetails(error))
        enqueueSnackbar(authFailMessages.unknownError.message, {
          variant: authFailMessages.unknownError.severity,
          action: showErrorAction,
        })
      })
      .finally(() => {
        setPendingLogin(false)
      })
  }

  useEffect(() => {
    setCheckingLogin(true)
    checkAuth().then(({ result, errorData }) => {
      switch (result) {
        case AuthCheck.Authenticated:
          router.push('/home')
          return
        case AuthCheck.Unauthorized:
          break
        case AuthCheck.InvalidToken:
          enqueueSnackbar(authFailMessages.invalidToken.message, {
            variant: authFailMessages.invalidToken.severity,
          })
          break
        case AuthCheck.NetworkError:
          setErrorDetails(JSON.stringify(errorData, undefined, ' '))
          enqueueSnackbar(authFailMessages.networkError.message, {
            variant: authFailMessages.networkError.severity,
          })
          break
        case AuthCheck.UnknownError:
          setErrorDetails(JSON.stringify(errorData, undefined, ' '))
          enqueueSnackbar(authFailMessages.unknownError.message, {
            variant: authFailMessages.unknownError.severity,
            action: showErrorAction,
          })
          break
      }
      setCheckingLogin(false)
    })
  }, [])

  return (
    <>
      <ErrorInfoDialog
        open={showError}
        errorDetails={errorDetails ?? ''}
        onClose={() => setShowError(false)}
      />
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
const ErrorInfoDialog = (props: { onClose: () => void; open: boolean; errorDetails: string }) => {
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Authentication error</DialogTitle>
      <DialogContent>
        <DialogContentText>Error details:</DialogContentText>
        <Paper sx={{ fontFamily: 'monospace', whiteSpace: 'pre', overflowX: 'auto', p: '1em' }}>
          <Typography component={'code'}>{props.errorDetails}</Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}
