import React from 'react';
import './ReviewModal.css'; 
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({
  open,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Write a Review</h2>
        <div className="modal-body">
          <div className="rating-container">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="star"
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    size={30}
                  />
                </label>
              );
            })}
            <span className="rating-text">
              {rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''}` : ''}
            </span>
          </div>

          <textarea
            className="comment-textarea"
            rows={4}
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="submit-button" onClick={onSubmit}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;