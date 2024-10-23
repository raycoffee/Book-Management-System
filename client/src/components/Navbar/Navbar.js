import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title">
           <p>[ Book Management ]</p>
        </Link>

        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <button
                className="navbar-button"
                onClick={() => navigate("/my-books")}
              >
                My Books
              </button>
              <button className="navbar-button logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="navbar-button"
              onClick={() => navigate("/signin")}
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
