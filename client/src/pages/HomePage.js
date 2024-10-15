// src/pages/HomePage.js
import React, { useContext } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/signin');
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 10, 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 4
      }}
    >
      <Typography 
        variant="h3" 
        fontWeight="bold" 
        sx={{ 
          color: '#6a1b9a', 
          mb: 3,
          background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Welcome to Your Book Management System
      </Typography>

      {isLoggedIn ? (
        <Stack direction="row" spacing={3}>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1rem',
              '&:hover': { background: '#8e24aa' },
            }}
            onClick={() => navigate('/my-books')}
          >
            Go to My Books
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              borderColor: '#d81b60',
              color: '#d81b60',
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1rem',
              '&:hover': {
                background: '#ffebee',
                borderColor: '#d81b60',
              },
            }}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Stack>
      ) : (
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
            color: '#fff',
            px: 6,
            py: 1.5,
            borderRadius: 8,
            fontSize: '1.2rem',
            '&:hover': { background: '#8e24aa' },
          }}
          onClick={() => navigate('/signin')}
        >
          Sign In to Continue
        </Button>
      )}
    </Container>
  );
}

export default HomePage;
