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
import { useNavigate, Link } from 'react-router-dom'; // Use Link from react-router-dom for navigation
import ReviewModal from './ReviewModal';

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null); // Track review for edit
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks(response.data);
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
      fetchBooks(); // Refresh the book list after deletion
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
      setSelectedReview(null); // Reset review state
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
      fetchBooks(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Books</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-book')}
        >
          Add Book
        </Button>
      </Box>

      <Grid container spacing={4}>
        {books.map((book) => {
          const userReview = book.reviews.find((review) => review.userId === userId); // Get the user's review, if any

          return (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={book.thumbnail || 'https://via.placeholder.com/150'}
                  alt={book.title}
                />
                <CardContent>
                <Typography variant="h6" component={Link} to={`/book/${book._id}`}    state={{ book }} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                {book.title}
              </Typography>
              
                  <Typography>{book.author}</Typography>

                  {/* Book Delete Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton
                      onClick={() => handleDeleteBook(book._id)}
                      color="error"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>

                  {/* User's Review Section */}
                  {userReview ? (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd' }}>
                      <Typography variant="body2">
                        {userReview.username}: {userReview.comment} ({userReview.rating} Stars)
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => handleEditReview(book, userReview)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteReview(book._id, userReview._id)}
                          color="error"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    /* Show Write Review Button if the user has no review */
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedBook(book)}
                        fullWidth
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
