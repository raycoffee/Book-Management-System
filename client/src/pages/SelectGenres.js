import React, { useState, useEffect } from 'react';
import { Container, Grid, Checkbox, Typography, Button, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const genres = [
  'Art', 'Biography', 'Business', 'Fantasy', 'History', 'Horror',
  'Comics', 'Manga', 'Music', 'Philosophy', 'Romance', 'Science Fiction',
  'Self Help', 'Thriller', 'Young Adult', 'Mystery', 'Poetry', 'Nonfiction'
];

function SelectGenres() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    if (!userId) {
      console.error('UserId not found. Redirecting to sign in...');
      navigate('/signin'); // Redirect to sign-in if userId is missing
    }
  }, [userId, navigate]);

  const handleCheckboxChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        console.error('No token found. Redirecting to login...');
        navigate('/signin');
        return;
      }

      // Save genres in the backend
      await axios.put(
        `http://localhost:3001/api/v1/users/${userId}/genres`,
        { favoriteGenres: selectedGenres },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Bearer format
          },
        }
      );

      // Store genres in localStorage to use them in BooksPage
      localStorage.setItem('favoriteGenres', JSON.stringify(selectedGenres));

      // Redirect to the books page after saving genres
      navigate('/books');
    } catch (error) {
      console.error('Failed to save favorite genres:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Select Your Favorite Genres
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {genres.map((genre) => (
          <Grid item xs={6} sm={4} md={3} key={genre}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleCheckboxChange(genre)}
                />
              }
              label={genre}
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '2rem' }}
        disabled={selectedGenres.length === 0}
      >
        Save and Continue
      </Button>
    </Container>
  );
}

export default SelectGenres;
