// Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logOut();
    navigate("/signin");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title">
          <p>[ Book Management ]</p>
        </Link>

        {/* Hamburger Menu Button */}
        <button className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <>
              <button
                className="navbar-button"
                onClick={() => {
                  navigate("/my-books");
                  setIsMenuOpen(false);
                }}
              >
                My Books
              </button>
              <button 
                className="navbar-button logout"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="navbar-button"
              onClick={() => {
                navigate("/signin");
                setIsMenuOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;