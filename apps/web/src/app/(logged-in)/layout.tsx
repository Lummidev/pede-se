import UserAppBar from '@/components/UserAppBar'
import Box from '@mui/material/Box'

export default function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Box>
      <UserAppBar />
      <Box>{children}</Box>
    </Box>
  )
}
