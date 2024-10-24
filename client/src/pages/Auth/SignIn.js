import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.js";
import "./SignIn.css";

const API_URL = process.env.REACT_APP_API_URL;

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setIsLoggedIn, setUser, user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (isLoggedIn && user) {
      navigate("/");
    }
  }, [user, isLoggedIn, navigate]);

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
        `${API_URL}/api/v1/users/sign-in`,
        credentials,
        { withCredentials: true }
      );
      setIsLoggedIn(true);

      setUser(response.data.data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      <form className="signin-form" onSubmit={handleSubmit}>
        <input
          className="signin-input"
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
        />
        <input
          className="signin-input"
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button className="signin-button" type="submit">
          Sign In
        </button>
      </form>
      <div className="signin-footer">
        <p>
          Don't have an account?{" "}
          <RouterLink to="/signup" className="signin-link">
            Sign Up
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
