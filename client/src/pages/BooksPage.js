// src/pages/BooksPage.js
import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  Button, IconButton, Rating 
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import axios from 'axios';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

  useEffect(() => {
    if (favoriteGenres.length > 0) {
      fetchBooksByGenres(favoriteGenres);
    }
  }, [favoriteGenres]);

  const fetchBooksByGenres = async (genres) => {
    try {
      const allBooks = [];
      for (const genre of genres) {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=6`
        );
        allBooks.push(...(response.data.items || []));
      }
      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading books...</Typography>;

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Books Based on Your Favorite Genres
      </Typography>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
                alt={book.volumeInfo.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {book.volumeInfo.title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {book.volumeInfo.publishedDate}
                </Typography>
                <Rating
                  name={`rating-${book.id}`}
                  defaultValue={0}
                  max={5}
                  precision={0.5}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <Button variant="outlined">Want to Read</Button>
                  <IconButton>
                    <FavoriteBorder />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BooksPage;
