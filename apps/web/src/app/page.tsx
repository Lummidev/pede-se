'use client'
import { LoginForm } from '@/components/Login/LoginForm'
import { LoginInfo } from '@/components/Login/LoginInfo'
import { apiClient } from '@/lib/apiClient'
import { AuthCheck, checkAuth } from '@/lib/auth'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
export default function LoginPage() {
  const [pendingLogin, setPendingLogin] = useState(false)
  const [checkingLogin, setCheckingLogin] = useState(false)
  const [shouldShowAuthError, setShouldShowAuthError] = useState(false)
  const [authErrorKey, setAuthErrorKey] = useState<AuthFailMessageKey>('unauthorized')
  const router = useRouter()
  const showAuthError = (errorKey: AuthFailMessageKey) => {
    setShouldShowAuthError(true)
    setAuthErrorKey(errorKey)
  }
  const handleLogin = (target: HTMLFormElement) => {
    const formData = new FormData(target)
    const loginData = {
      body: {
        email: formData.get('email')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
      },
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
        if (error.kind === 'network') {
          showAuthError('couldNotCheck')
        }
        if (error.isValidationError() || error.isStatus(400)) {
          showAuthError('invalidCredentials')
        }
        setPendingLogin(false)
      })
  }
  useEffect(() => {
    checkAuth().then(({ result, errorData }) => {
      let errorKey: AuthFailMessageKey
      switch (result) {
        case AuthCheck.Authenticated:
          router.push('/home')
          return
        case AuthCheck.Unauthorized:
          return
        case AuthCheck.InvalidToken:
          errorKey = 'invalidToken'
          break
        case AuthCheck.CouldNotCheck:
          errorKey = 'couldNotCheck'
          break
        case AuthCheck.UnknownError:
          errorKey = 'unknownError'
          break
      }
      showAuthError(errorKey)
      setCheckingLogin(false)
    })
  }, [])

  return (
    <>
      <AuthFailSnackBar
        open={shouldShowAuthError}
        handleClose={() => setShouldShowAuthError(false)}
        messageKey={authErrorKey}
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

type AuthFailMessageKey = keyof typeof authFailMessages

const authFailMessages = {
  unauthorized: { message: 'You are logged out.', severity: 'warning' as const },
  invalidToken: {
    message: 'You were logged out. Please login again.',
    severity: 'warning' as const,
  },
  couldNotCheck: {
    message: 'Could not verify your credentials. Check your connection and try again.',
    severity: 'error' as const,
  },
  unknownError: {
    message: 'Unknown error while verifying your login. Check details below.',
    severity: 'error' as const,
  },
  invalidCredentials: {
    message: 'The inserted email/password combination is not correct.',
    severity: 'error' as const,
  },
}
const AuthFailSnackBar = ({
  open,
  handleClose,
  messageKey,
}: {
  open: boolean
  handleClose: () => void
  messageKey: AuthFailMessageKey
}) => {
  const message = authFailMessages[messageKey]
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((key) => key + 1)
  }, [message])
  return (
    <Snackbar
      key={key}
      open={open}
      autoHideDuration={8000}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return
        }
        handleClose()
      }}
    >
      <Alert
        onClose={handleClose}
        severity={message.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message.message}
      </Alert>
    </Snackbar>
  )
}
