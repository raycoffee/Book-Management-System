import React, { useContext } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import theme from '../theme';
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
        mt: theme.spacing.marginY,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '2rem',
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: theme.palette.primary.main,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              color: theme.palette.text.light,
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1rem',
              '&:hover': { background: theme.palette.primary.hoverDark },
            }}
            onClick={() => navigate('/my-books')}
          >
            Go to My Books
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.hoverLighter,
              color: theme.palette.primary.hoverDark,
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1rem',
              '&:hover': {
                background: theme.palette.primary.hoverLight,
                borderColor: theme.palette.primary.main,
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
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            color: theme.palette.text.light,
            px: 6,
            py: 1.5,
            borderRadius: 8,
            fontSize: '1.2rem',
            '&:hover': { background: theme.palette.primary.hoverDark },
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
