'use client'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import { useState, MouseEvent } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import MenuBook from '@mui/icons-material/MenuBook'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/apiClient'
import { clearAuthToken } from '@/lib/auth'
const pages: { displayName: string; href: string }[] = [
  { displayName: 'Menu', href: '/menu' },
  { displayName: 'Orders', href: '/orders' },
  { displayName: 'Store Settings', href: '/settings' },
]

export default function UserAppBar() {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <MobileMenu />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <WideScreenMenu />
          </Box>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

function UserMenu() {
  const router = useRouter()
  const logout = () => {
    apiClient.api.profile.accessTokens
      .destroy({})
      .safe()
      .then(([data, error]) => {
        if (data) {
          clearAuthToken()
          router.push('/')
          return
        }
        if (error.kind === 'network') {
          console.error('Could not log out because of a network error')
        }
        if (error.isStatus(422)) {
          console.error('Not logged in')
        }
      })
  }
  const userMenuItems: { id: number; display: string; onClick: () => void }[] = [
    {
      id: 1,
      display: 'Account',
      onClick: () => {
        router.push('/Account')
      },
    },
    {
      id: 2,
      display: 'Logout',
      onClick: logout,
    },
  ]
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="User settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {userMenuItems.map((setting) => (
          <MenuItem
            key={setting.id}
            onClick={() => {
              handleCloseUserMenu()
              setting.onClick()
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{setting.display}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

function MobileMenu() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  return (
    <>
      <Tooltip title="Open menu">
        <IconButton
          size="large"
          aria-label="Menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      <Logo variant="mobile" />
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={!!anchorElNav}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {pages.map((page) => (
          <MenuItem
            key={page.displayName}
            onClick={handleCloseNavMenu}
            href={page.href}
            LinkComponent={Link}
          >
            <Typography sx={{ textAlign: 'center' }}>{page.displayName}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function WideScreenMenu() {
  return (
    <>
      <Logo />
      {pages.map((page) => (
        <Button
          key={page.displayName}
          href={page.href}
          LinkComponent={Link}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page.displayName}
        </Button>
      ))}
    </>
  )
}

function Logo({ variant }: { variant?: 'widescreen' | 'mobile' }) {
  const isMobile = variant === 'mobile'
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <MenuBook sx={{ mr: 1 }} />
      <Typography
        variant={isMobile ? 'h5' : 'h6'}
        noWrap
        component={Link}
        href="/home"
        sx={{
          mr: 2,
          flexGrow: isMobile ? 1 : undefined,
          fontFamily: 'monospace',
          fontWeight: 800,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        PEDE-SE
      </Typography>
    </Box>
  )
}
