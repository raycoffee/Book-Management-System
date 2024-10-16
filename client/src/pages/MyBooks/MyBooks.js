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
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ReviewModal from '../ReviewModal';

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const userId = localStorage.getItem('userId');
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
useEffect(() => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!userId || !token) {
    navigate('/signin'); 
  } else {
    fetchBooks();
  }
}, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/books/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Now response.data contains userBook records, each with populated bookId
      setBooks(response.data.map(userBook => userBook.bookId));
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };
  

  const handleDeleteReview = async (bookId, reviewId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/books/${bookId}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleEditReview = (book, review) => {
    setSelectedBook(book);
    setSelectedReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleReviewSubmit = async () => {
    try {
      const url = selectedReview
        ? `http://localhost:3001/api/v1/books/${selectedBook._id}/reviews/${selectedReview._id}`
        : `http://localhost:3001/api/v1/books/${selectedBook._id}/reviews`;

      const method = selectedReview ? 'put' : 'post';

      await axios[method](
        url,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(0);
      setComment('');
      setSelectedBook(null);
      setSelectedReview(null);
      fetchBooks();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/books/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
          My Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-book')}
          sx={{
            background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
            color: '#fff',
            px: 3,
            py: 1.2,
            borderRadius: '8px',
            '&:hover': { background: '#8e24aa' },
          }}
        >
          Add Book
        </Button>
      </Box>

      <Grid container spacing={4}>
        {books.map((book) => {
          const userReview = book.reviews.find((review) => review.userId === userId);

          return (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card
                sx={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={book.thumbnail || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  sx={{ borderBottom: '1px solid #ddd' }}
                />
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/book/${book._id}`}
                    state={{ book }}
                    sx={{
                      textDecoration: 'none',
                      color: '#6a1b9a',
                      fontWeight: 'bold',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575', mt: 1 }}>
                    {book.author}
                  </Typography>

                  {/* Book Delete Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton
                      onClick={() => handleDeleteBook(book._id)}
                      color="error"
                      sx={{
                        '&:hover': { backgroundColor: '#ffebee' },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>

                  {/* User's Review Section */}
                  {userReview ? (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                      <Typography variant="body2" sx={{ color: '#6a1b9a' }}>
                        {userReview.username}: {userReview.comment} ({userReview.rating} Stars)
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => handleEditReview(book, userReview)}
                          color="primary"
                          sx={{
                            '&:hover': { backgroundColor: '#e8eaf6' },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteReview(book._id, userReview._id)}
                          color="error"
                          sx={{
                            '&:hover': { backgroundColor: '#ffebee' },
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedBook(book)}
                        fullWidth
                        sx={{
                          color: '#6a1b9a',
                          borderColor: '#6a1b9a',
                          borderRadius: '8px',
                          '&:hover': { backgroundColor: '#f3e5f5' },
                        }}
                      >
                        Write a Review
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <ReviewModal
        open={!!selectedBook}
        onClose={() => {
          setSelectedBook(null);
          setSelectedReview(null);
          setRating(0);
          setComment('');
        }}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmit={handleReviewSubmit}
        isEdit={!!selectedReview}
      />
    </Container>
  );
}

export default MyBooks;
