import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./HomePage.css";

const HomePage = () => {
  const { isLoggedIn, logOut, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/signin');
    }
  }, [isLoggedIn, navigate, loading, user]);

  const handleLogout = () => {
    logOut();
    navigate("/signin");
  };

  if (loading) {
    return <div className="homepage-container">Loading...</div>;
  }


  if (!user) {
    console.log("No user data available in HomePage");
  }

  return (
    <div className="homepage-container">
      {isLoggedIn && user?.name && (
        <h1 className="homepage-title">[ Hello, {user.name}! ]</h1>
      )}

      {isLoggedIn ? (
        <>
          <div className="home-hero-img">
            <img src="/images/hero-img.png" alt="Hero" />
          </div>
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
        </>
      ) : (
        <button className="primary-button" onClick={() => navigate("/signin")}>
          Sign In to Continue
        </button>
      )}
    </div>
  );
}

export default HomePage;