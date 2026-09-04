'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { CssBaseline, InitColorSchemeScript } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  )
}
