import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './SelectGenres.css';

const genres = [
  "Art", "Biography", "Business", "Fantasy", "History", "Horror",
  "Comics", "Manga", "Music", "Philosophy", "Romance", "Science Fiction",
  "Self Help", "Thriller", "Young Adult", "Mystery", "Poetry", "Nonfiction"
];

const API_URL = process.env.REACT_APP_API_URL;

const SelectGenres = () => {
  const { isLoggedIn, setUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/users/genres`,
        { favoriteGenres: selectedGenres },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setUser(response.data.data.user);
        navigate('/my-books');
      }
    } catch (error) {
      console.error('Failed to save favorite genres:', error);
      setError(error.response?.data?.message || 'Failed to save genres');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="genre-selection__auth-container">
        <button 
          className="genre-selection__signin-btn"
          onClick={() => navigate('/signin')}
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="genre-selection__wrapper">
      <h2 className="genre-selection__heading">
        Select Your Favorite Genres
      </h2>
      
      {error && (
        <div className="genre-selection__error">
          {error}
        </div>
      )}
      
      <div className="genre-selection__grid">
        {genres.map((genre) => (
          <label key={genre} className="genre-selection__checkbox-label">
            <input
              type="checkbox"
              className="genre-selection__checkbox-input"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleCheckboxChange(genre)}
            />
            {genre}
          </label>
        ))}
      </div>

      <button
        className="genre-selection__submit-btn"
        onClick={handleSubmit}
        disabled={selectedGenres.length === 0}
      >
        Save and Continue
      </button>
    </div>
  );
};

export default SelectGenres;