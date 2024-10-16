import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import theme from '../../theme'; // Import the theme

function SignUp() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const { setIsLoggedIn } = useContext(AuthContext); // Access the function from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/v1/users/register', user);
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setIsLoggedIn(true); // Update authentication state
      navigate('/select-genres');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: theme.spacing.marginY }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.hoverLighter,
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.hoverLighter,
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.hoverLighter,
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: theme.spacing.marginTop,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.hoverLighter,
            },
          }}
        >
          Sign Up
        </Button>
      </form>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/signin"
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { color: theme.palette.primary.hoverDark },
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignUp;
