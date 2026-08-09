import { LoginForm } from '@/components/Login/LoginForm'
import { LoginInfo } from '@/components/Login/LoginInfo'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

export default function Home() {
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
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
