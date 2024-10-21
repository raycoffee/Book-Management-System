import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.js";

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/users/sign-in",
        credentials,
        { withCredentials: true }
      );

      setIsLoggedIn(true);
      setUser(response.data.user);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 4 }}>
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
          sx={{ marginTop: 2 }}
        >
          Sign In
        </Button>
      </form>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/signup">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignIn;
