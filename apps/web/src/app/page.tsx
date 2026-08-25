'use client'
import { LoginForm } from '@/components/Login/LoginForm'
import { LoginInfo } from '@/components/Login/LoginInfo'
import { apiClient } from '@/lib/apiClient'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function LoginPage() {
  const [pendingLogin, setPendingLogin] = useState(false)
  const router = useRouter()
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
        }
        if (error) {
          setPendingLogin(false)
        }
      })
  }
  return (
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
            <LoginForm handleLogin={handleLogin} pendingLogin={pendingLogin} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
