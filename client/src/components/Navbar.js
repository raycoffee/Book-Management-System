// src/components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/signin');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(45deg, #673ab7, #ab47bc)', // Matching with staple image colors
        paddingY: 1,
        boxShadow: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Name */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': { color: '#ede7f6' }, // Soft lavender hover effect
          }}
        >
          Book Management
        </Typography>

        {/* Navigation Links */}
        <Box>
          {isLoggedIn ? (
            <>
              <Button
                sx={{
                  color: '#fff',
                  marginRight: 2,
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  textTransform: 'none', // Friendly feel
                  '&:hover': {
                    backgroundColor: '#9c27b0', // Slightly lighter purple on hover
                  },
                }}
                onClick={() => navigate('/my-books')}
              >
                My Books
              </Button>
              <Button
                sx={{
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#8e24aa', // Darker hover for Logout
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              sx={{
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 'medium',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#8e24aa', // Consistent hover effect
                },
              }}
              onClick={() => navigate('/signin')}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
