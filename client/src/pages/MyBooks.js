import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyBooks() {
  const [books, setBooks] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/books/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4} 
        sx={{ borderBottom: '2px solid #8e24aa', pb: 2 }}
      >
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ color: '#6a1b9a' }}
        >
          My Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
            color: '#fff',
            '&:hover': {
              background: '#8e24aa',
            },
          }}
          onClick={() => navigate('/add-book')}
        >
          Add Book
        </Button>
      </Box>

      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={book.thumbnail || 'https://via.placeholder.com/150'}
                alt={book.title}
                sx={{ borderRadius: '12px 12px 0 0' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ color: '#6a1b9a', fontWeight: 'bold' }}
                >
                  {book.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {book.author}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontStyle: 'italic' }}
                >
                  Genre: {book.genre}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  color="error"
                  onClick={() => handleDelete(book._id)}
                  sx={{
                    '&:hover': {
                      background: '#ffebee',
                    },
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default MyBooks;
