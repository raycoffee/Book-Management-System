import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './SignUp.css';

const API_URL = process.env.REACT_APP_API_URL;

function SignUp() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const { setIsLoggedIn, setUser: setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/v1/users/register`, user, {
        withCredentials: true
      });
      
      
      setIsLoggedIn(true);
      setAuthUser(response.data.user); 
      
     
      navigate('/select-genres');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
        />
        <input
          className="signup-input"
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          className="signup-input"
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
        <button className="signup-button" type="submit">
          Sign Up
        </button>
      </form>
      <div className="signup-footer">
        <p>
          Already have an account?{' '}
          <RouterLink to="/signin" className="signup-link">
            Sign In
          </RouterLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;