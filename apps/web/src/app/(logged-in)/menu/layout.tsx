'use client'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { SyntheticEvent, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
export default function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    router.push(newValue)
  }

  return (
    <Box
      sx={{
        p: {
          md: '2em',
          sm: '1em',
          xs: '0.5em',
        },
      }}
    >
      <Typography variant="h3">Menu</Typography>
      <TabContext value={pathname}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Menu page tabs">
            <Tab label="Categories" value="/menu/categories" />
            <Tab label="Products" value="/menu/products" />
          </TabList>
        </Box>
      </TabContext>
      <Box
        sx={{
          py: {
            md: '1em',
            xs: '0.5em',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
