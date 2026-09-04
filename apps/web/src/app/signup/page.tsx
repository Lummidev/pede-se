'use client'
import Container from '@mui/material/Container'
import { SignupFields, SignupForm } from '@/components/Signup/SignupForm'
import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { useRouter } from 'next/navigation'
import { Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

export default function SignUp() {
  const [pendingSignup, setPendingSignup] = useState(false)
  const [errors, setErrors] = useState<{ field: string; message: string }[] | undefined>()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const handleSignup = (fields: SignupFields) => {
    setErrors(undefined)
    setPendingSignup(true)
    apiClient.api.auth.newAccount
      .store({ body: fields })
      .safe()
      .then(([data, error]) => {
        if (data) {
          localStorage.setItem('token', data.data.token)
          router.push('/home')
          return
        }
        if (error.kind === 'network') {
          enqueueSnackbar(
            'Could not create the account due to a network error. Check your connection and try again.',
            { variant: 'error' }
          )
        }
        if (error.isValidationError()) {
          setErrors(error.response.errors)
        }
        setPendingSignup(false)
      })
  }
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Stack spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
          <Typography variant="h2">Create Account</Typography>
          <SignupForm handleSignup={handleSignup} pendingSignup={pendingSignup} errors={errors} />
        </Stack>
      </Container>
    </>
  )
}
