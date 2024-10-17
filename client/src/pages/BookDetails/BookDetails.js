import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Rating,
  IconButton,
  CircularProgress,
  TextField,
  Grid2
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function BookDetails() {
  const { bookId } = useParams();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  const book = location.state?.book;

  useEffect(() => {
    if (book) {
      fetchData();
    }
  }, [book]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBookDescription(book.title), fetchReviews()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDescription = async (title) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`
      );
      const bookData = response.data.items[0].volumeInfo;
      setBookDescription(bookData.description || 'No description available');
    } catch (error) {
      console.error('Failed to fetch book description:', error);
    }
  };

  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user is not authenticated.');
        return;
      }
  
      const response = await axios.get(`http://localhost:3001/api/v1/books/${book._id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const allReviews = response.data.reviews;
      const userReview = allReviews.find((review) => review.userId === userId);
      const communityReviews = allReviews.filter((review) => review.userId !== userId);
  
      setUserReview(userReview);
      setReviews(communityReviews);
      setAverageRating(response.data.averageRating);  // Set average rating
      setTotalReviews(response.data.totalReviews);    // Set total reviews count
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };
  

  const handleReviewSubmit = async () => {
    try {
      const method = userReview ? 'put' : 'post';
      const url = userReview
        ? `http://localhost:3001/api/v1/books/${book._id}/reviews/${userReview._id}`
        : `http://localhost:3001/api/v1/books/${book._id}/reviews`;

      await axios[method](url, { rating, comment }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/books/${book._id}/reviews/${userReview._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserReview(null);
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return <Typography variant="h6" align="center">No book found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid2 container spacing={4}>
        <Grid2 item xs={12} sm={4}>
          <Box
            component="img"
            src={book.thumbnail || 'https://via.placeholder.com/150'}
            alt={book.title}
            sx={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Grid2>

        <Grid2 item xs={12} sm={8}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {book.title}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            {book.author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Rating value={averageRating} precision={0.1} readOnly />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {averageRating.toFixed(2)} ({totalReviews} reviews)
          </Typography>
        </Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {bookDescription}
          </Typography>
  
        
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#6a1b9a', fontWeight: 'bold' }}>
              Your Review
            </Typography>
            {userReview ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ flexGrow: 1 }}>{userReview.comment}</Typography>
                <Rating value={userReview.rating} readOnly sx={{ ml: 2 }} />
                <IconButton
                  color="primary"
                  sx={{
                    '&:hover': { backgroundColor: '#8e24aa', color: '#fff' },
                  }}
                  onClick={() => setRating(userReview.rating)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  sx={{
                    '&:hover': { backgroundColor: '#d32f2f', color: '#fff' },
                  }}
                  onClick={handleDeleteReview}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write your review"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #6a1b9a, #d81b60)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    borderRadius: 8,
                    fontSize: '1rem',
                    '&:hover': { background: '#8e24aa' },
                  }}
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#6a1b9a', fontWeight: 'bold' }}>
              Community Reviews
            </Typography>
            {reviews.length === 0 ? (
              <Typography>No reviews yet.</Typography>
            ) : (
              reviews.map((review) => (
                <Box
                  key={review._id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f3e5f5',
                  }}
                >
                  <Typography variant="body1" fontWeight="bold" sx={{ color: '#6a1b9a' }}>
                    {review.username}
                  </Typography>
                  <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                  <Typography>{review.comment}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default BookDetails;
