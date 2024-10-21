import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Rating,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import axios from "axios";

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [bookDescription, setBookDescription] = useState(
    "No description available"
  );
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { isLoggedIn } = useContext(AuthContext);

  console.log(userReview, "😻");

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/books/${bookId}`,
          {
            withCredentials: true,
          }
        );
        const fetchedBook = response.data;
        setBook(fetchedBook);
        console.log(fetchedBook, "happy?");

        const googleBooksResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?key=${"AIzaSyBL-nSxptDK8cKwQjj3KRcOMkGxyLotV7s"}&q=${encodeURIComponent(
            fetchedBook.title
          )}`
        );

        const googleBooksData = googleBooksResponse.data.items[0]?.volumeInfo;
        setBookDescription(
          googleBooksData?.description || "No description available"
        );

        let reviewEndpoint = `http://localhost:3001/api/v1/reviews/${bookId}`;
        if (isLoggedIn) {
          reviewEndpoint = `http://localhost:3001/api/v1/reviews/auth/${bookId}`;
        }

        console.log(reviewEndpoint, "👹");

        const reviewsResponse = await axios.get(reviewEndpoint, {
          withCredentials: true,
        });

        setReviews(reviewsResponse.data.reviews);
        setAverageRating(reviewsResponse.data.averageRating);
        setTotalReviews(reviewsResponse.data.totalReviews);
        setUserReview(reviewsResponse.data.userReview);
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, isLoggedIn]);

  const handleReviewSubmit = async () => {
    try {
      const method = userReview ? "put" : "post";
      const url = userReview
        ? `http://localhost:3001/api/v1/reviews/${userReview._id}`
        : `http://localhost:3001/api/v1/reviews/${book._id}`;

      await axios[method](
        url,
        { rating, comment },
        {
          withCredentials: true,
        }
      );

      setRating(0);
      setComment("");
      // await fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/reviews/${userReview._id}`,
        {
          withCredentials: true,
        }
      );
      setUserReview(null);
      setRating(0);
      setComment("");
      // await fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Typography variant="h6" align="center">
        No book found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        spacing={4}
      >
        <Box
          component="img"
          src={book.thumbnail || "https://via.placeholder.com/150"}
          alt={book.title}
          sx={{
            width: "100%",
            maxWidth: "300px",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #6a1b9a, #d81b60)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {book.title}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            {book.author}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {averageRating.toFixed(2)} ({totalReviews} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {bookDescription}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#6a1b9a", fontWeight: "bold" }}
            >
              Your Review
            </Typography>
            {userReview ? (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ flexGrow: 1 }}>
                  {userReview.comment}
                </Typography>
                <Rating value={userReview.rating} readOnly sx={{ ml: 2 }} />
                <IconButton
                  color="primary"
                  onClick={() => {
                    setRating(userReview.rating);
                    setComment(userReview.comment);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={handleDeleteReview}>
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
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #6a1b9a, #d81b60)",
                    color: "#fff",
                  }}
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#6a1b9a", fontWeight: "bold" }}
            >
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
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f3e5f5",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: "#6a1b9a" }}
                  >
                    {review.username}
                  </Typography>
                  <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                  <Typography>{review.comment}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default BookDetails;
