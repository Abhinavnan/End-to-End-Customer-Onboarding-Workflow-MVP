import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component={Link} to="/"  
            sx={{ flexGrow: 1, color: 'inherit', '&:hover': { color: 'inherit' }  }}>
             Trade Desk
          </Typography>
          <IconButton size="large" href='/profile' edge="end" color="inherit" aria-label="profile" 
            sx={{ '&:hover': { color: 'inherit' }, color: 'inherit' }}>
            <AccountCircleIcon sx={{ fontSize: '2.5rem' }}/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header;
