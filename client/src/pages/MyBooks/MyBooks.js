import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReviewModal from "../../components/ReviewModal/ReviewModal.js";
import { AuthContext } from "../../context/AuthContext.js";
import "./MyBooks.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
const API_URL = process.env.REACT_APP_API_URL;

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
    }
  }, [isLoggedIn]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/books/user`, {
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
        `${API_URL}/api/v1/reviews/${reviewId}`,
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
        ? `${API_URL}/api/v1/reviews/${selectedReview._id}`
        : `${API_URL}/api/v1/reviews/${selectedBook._id}`;
      const method = selectedReview ? "put" : "post";

      await axios[method](
        url,
        { rating, comment },
        {
          withCredentials: true,
        }
      );

      setRating(0);
      setComment("");
      setSelectedBook(null);
      setSelectedReview(null);
      setBooks([]);
      fetchBooks();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/api/v1/books/user/${bookId}`, {
        withCredentials: true,
      });
      fetchBooks();
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className="my-books-container">
      <div className="my-books-header">
        <h1 className="my-books-title">My Books</h1>
        <button className="add-book-button" onClick={() => navigate("/add-book")}>
          <span className="add-icon">+</span> Add Book
        </button>
      </div>
      <div className="books-grid">
        {books?.map((book) => {
          const userReview = book.reviewId;
          const userBook = book.bookId;
  
          return (
            <div className="book-card" key={userBook?._id}>
              <img
                className="book-image"
                src={userBook?.thumbnail || "https://via.placeholder.com/150"}
                alt={userBook?.title}
              />
              <div className="book-content">
                <Link to={`/book/${userBook?._id}`} className="book-title">
                  {userBook?.title}
                </Link>
                <p className="book-author">{userBook?.author}</p>
                <button
                  className="delete-book-button"
                  onClick={() => handleDeleteBook(userBook?._id)}
                >
                  <FaTrashAlt /> {/* Add delete icon */}
                </button>
                {userReview ? (
                  <div className="review-box">
                    <p className="review-text">
                      {userReview?.username}: {userReview?.comment} (
                      {userReview?.rating} Stars)
                    </p>
                    <div className="review-actions">
                      <button
                        className="edit-review-button"
                        onClick={() => handleEditReview(userBook, userReview)}
                      >
                        <FaEdit /> {/* Add edit icon */}
                      </button>
                      <button
                        className="delete-review-button"
                        onClick={() => handleDeleteReview(userReview?._id)}
                      >
                        <FaTrashAlt /> {/* Add delete icon */}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="write-review-button"
                    onClick={() => setSelectedBook(userBook)}
                  >
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
    </div>
  );
};

export default MyBooks;