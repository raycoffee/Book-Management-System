import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import theme from '../theme'; // Import the theme

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
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        paddingY: 1,
        boxShadow: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: theme.palette.text.light,
            fontWeight: 'bold',
            '&:hover': { color: theme.palette.primary.hoverLight },
          }}
        >
          Book Management
        </Typography>

        <Box>
          {isLoggedIn ? (
            <>
              <Button
                sx={{
                  color: theme.palette.text.light,
                  marginRight: 2,
                  fontSize: theme.typography.fontSize,
                  fontWeight: theme.typography.fontWeight,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.hoverLighter,
                  },
                }}
                onClick={() => navigate('/my-books')}
              >
                My Books
              </Button>
              <Button
                sx={{
                  color: theme.palette.text.light,
                  fontSize: theme.typography.fontSize,
                  fontWeight: theme.typography.fontWeight,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.hoverDark,
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
                color: theme.palette.text.light,
                fontSize: theme.typography.fontSize,
                fontWeight: theme.typography.fontWeight,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.hoverDark,
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
