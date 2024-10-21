import React, { useState, useContext, useEffect } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReviewModal from "../ReviewModal";
import { AuthContext } from "../../context/AuthContext.js";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isLoggedIn, logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
    }
  }, [isLoggedIn]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/books/user`, {
        withCredentials: true,
      });
      setBooks([...response.data]);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/reviews/${reviewId}`,
        {
          withCredentials: true,
        }
      );
      fetchBooks();
    } catch (error) {
      console.error("Failed to delete review:", error);
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
        ? `http://localhost:3001/api/v1/reviews/${selectedReview._id}`
        : `http://localhost:3001/api/v1/reviews/${selectedBook._id}`;
      const method = selectedReview ? "put" : "post";


      await axios[method](
        url,
        { rating, comment },
        {
          withCredentials: true,
        }
      );

      // Reset state after submitting the review
      setRating(0);
      setComment("");
      setSelectedBook(null);
      setSelectedReview(null);
      setBooks([])
      fetchBooks(); // Refresh the books and reviews list after submission
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/books/user/${bookId}`, {
        withCredentials: true,
      });

      fetchBooks();
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6a1b9a" }}>
          My Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add-book")}
          sx={{
            background: "linear-gradient(45deg, #6a1b9a, #d81b60)",
            color: "#fff",
            px: 3,
            py: 1.2,
            borderRadius: "8px",
            "&:hover": { background: "#8e24aa" },
          }}
        >
          Add Book
        </Button>
      </Box>
      <Grid container spacing={4}>
        {books?.map((book) => {
          const userReview = book.reviewId;
          const userBook = book.bookId;

          return (
            <Grid item xs={12} sm={6} md={4} key={userBook?._id}>
              <Card
                sx={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    userBook?.thumbnail || "https://via.placeholder.com/150"
                  }
                  alt={userBook?.title}
                  sx={{ borderBottom: "1px solid #ddd" }}
                />
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/book/${userBook?._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "#6a1b9a",
                      fontWeight: "bold",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {userBook?.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", mt: 1 }}>
                    {userBook?.author}
                  </Typography>

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    <IconButton
                      onClick={() => handleDeleteBook(userBook?._id)}
                      color="error"
                      sx={{
                        "&:hover": { backgroundColor: "#ffebee" },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>


                  {userReview ? (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#6a1b9a" }}>
                        {userReview?.username}: {userReview?.comment} (
                        {userReview?.rating} Stars)
            
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => handleEditReview(userBook, userReview)}
                          color="primary"
                          sx={{
                            "&:hover": { backgroundColor: "#e8eaf6" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteReview(userReview?._id)
                          }
                          color="error"
                          sx={{
                            "&:hover": { backgroundColor: "#ffebee" },
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
                        onClick={() => setSelectedBook(userBook)}
                        fullWidth
                        sx={{
                          color: "#6a1b9a",
                          borderColor: "#6a1b9a",
                          borderRadius: "8px",
                          "&:hover": { backgroundColor: "#f3e5f5" },
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
        open={Boolean(selectedBook)}
        onClose={() => {
          setSelectedBook(null);
          setSelectedReview(null);
          setRating(0);
          setComment("");
        }}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmit={handleReviewSubmit}
        isEdit={Boolean(selectedReview)}
      />
    </Container>
  );
};

export default MyBooks;
