import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import theme from '../../theme'; // Import theme

function SignIn() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/v1/users/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: theme.spacing.marginY }}>
      <Typography variant="h5" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          margin="normal"
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
          Sign In
        </Button>
      </form>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup" sx={{ color: theme.palette.primary.main }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignIn;
