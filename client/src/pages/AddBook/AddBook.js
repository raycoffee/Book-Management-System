import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBook() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error fetching books from Google Books API:', error);
    }
  };

  const handleAddBook = async (book) => {
    const token = localStorage.getItem('token');
    const { title, authors, publishedDate, industryIdentifiers, imageLinks, categories } = book.volumeInfo;
  
    const newBook = {
      title,
      author: authors?.join(', ') || 'Unknown',
      published_date: publishedDate || 'N/A',
      ISBN: industryIdentifiers?.[0]?.identifier || 'N/A',
      genre: categories?.[0] || 'Unknown',
      thumbnail: imageLinks?.thumbnail || 'https://via.placeholder.com/150',
    };
  
    try {
      await axios.post('http://localhost:3001/api/v1/books', newBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Book added successfully!');
      navigate('/my-books');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* Title Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#fff',
          background: 'linear-gradient(45deg, #6a1b9a, #8e24aa)',
          borderRadius: 2,
          p: 2,
          mb: 4,
        }}
      >
        Search and Add a Book
      </Typography>

      {/* Search Field */}
      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          variant="outlined"
          label="Search for Books"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '75%',
            input: { color: '#6a1b9a' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': { borderColor: '#8e24aa' },
              '&:hover fieldset': { borderColor: '#d81b60' },
              '&.Mui-focused fieldset': { borderColor: '#6a1b9a' },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            ml: 2,
            background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
            borderRadius: 8,
            px: 4,
            ':hover': { background: '#8e24aa' },
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {/* Results Grid */}
      <Grid container spacing={4}>
        {searchResults.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
                alt={book.volumeInfo.title}
                sx={{ borderRadius: '8px 8px 0 0' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {book.volumeInfo.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {book.volumeInfo.categories?.[0] || 'Unknown'}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                sx={{
                  m: 2,
                  background: 'linear-gradient(45deg, #d81b60, #6a1b9a)',
                  ':hover': { background: '#8e24aa' },
                }}
                onClick={() => handleAddBook(book)}
              >
                Add Book
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AddBook;
