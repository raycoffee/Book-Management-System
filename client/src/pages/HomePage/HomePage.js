import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./HomePage.css";

function HomePage() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/signin");
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Your Book Management System</h1>

      {isLoggedIn ? (
        <div className="button-group">
          <button
            className="primary-button"
            onClick={() => navigate("/my-books")}
          >
            Go to My Books
          </button>
          <button className="outlined-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      ) : (
        <button className="primary-button" onClick={() => navigate("/signin")}>
          Sign In to Continue
        </button>
      )}
    </div>
  );
}

export default HomePage;
