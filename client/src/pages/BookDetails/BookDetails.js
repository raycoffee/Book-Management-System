import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import axios from "axios";
import "./BookDetails.css";
import ReviewModal from "../../components/ReviewModal/ReviewModal.js";
const API_URL = process.env.REACT_APP_API_URL;

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [bookDescription, setBookDescription] = useState("No description available");
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const { isLoggedIn, user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const reviewEndpoint = isLoggedIn
        ? `${API_URL}/api/v1/reviews/auth/${bookId}`
        : `${API_URL}/api/v1/reviews/${bookId}`;

      const reviewsResponse = await axios.get(reviewEndpoint, {
        withCredentials: true,
      });

      const { reviews, averageRating, totalReviews, userReview } = reviewsResponse.data;

      const filteredReviews = reviews.filter(
        (review) => review.userId !== user?._id
      );

      setReviews(filteredReviews);
      setAverageRating(averageRating);
      setTotalReviews(totalReviews);
      setUserReview(userReview);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/v1/books/${bookId}`, {
          withCredentials: true,
        });
        setBook(response.data);
  
        const bookDetailsResponse = await axios.get(`${API_URL}/api/v1/books/get-details`, {
          params: { title: response.data.title },
          withCredentials: true,
        });
        
        setBookDescription(bookDetailsResponse.data.description || "No description available");
  
        await fetchReviews();
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookData();
  }, [bookId, isLoggedIn, user]);

  const handleReviewSubmit = async () => {
    try {
      const method = userReview ? "put" : "post";
      const url = userReview
        ? `${API_URL}/api/v1/reviews/${userReview._id}`
        : `${API_URL}/api/v1/reviews/${book._id}`;

      const response = await axios[method](
        url,
        { rating, comment },
        { withCredentials: true }
      );

      const updatedReview = response.data;
      setUserReview(updatedReview);
      await fetchReviews();

      setRating(0);
      setComment("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/reviews/${userReview._id}`, {
        withCredentials: true,
      });

      setUserReview(null);
      await fetchReviews();

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (user === null || user?._id === undefined) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <h2>No book found.</h2>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <div className="book-details">
        <img
          src={book.thumbnail || "https://via.placeholder.com/150"}
          alt={book.title}
          className="book-image"
        />

        <div className="book-info">
          <h2 className="book-title">{book.title}</h2>
          <h4 className="book-author">by {book.author}</h4>
          <div className="rating-section">
            <span className="rating-value">
              ★ {averageRating.toFixed(2)} · {totalReviews} reviews
            </span>
          </div>
          <p className="book-description">{bookDescription}</p>

          <div className="user-review-section">
            <h3>Your Review</h3>
            {userReview ? (
              <div className="user-review">
                <span className="user-rating">★ {userReview.rating}</span>
                <p className="user-comment">{userReview.comment}</p>
                <div className="user-review-buttons">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setRating(userReview.rating);
                      setComment(userReview.comment);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete-button" onClick={handleDeleteReview}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-review-button"
                onClick={() => setIsModalOpen(true)}
              >
                Add Review
              </button>
            )}
          </div>

          <div className="community-reviews-section">
            <h3>Community Reviews</h3>
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <strong>{review.username}</strong>
                    <span className="review-rating">★ {review.rating}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default BookDetails;