import express from 'express';
import {
  addBookForUser,
  getBooksByUser,
  deleteBook,

} from '../controllers/bookController.js';

import {  getReviewsByBook,  addReview,
  updateReview,
  deleteReview,} from '../controllers/reviewsController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for books
router.post('/', authenticateToken, addBookForUser); // Add a new book
router.get('/:userId', authenticateToken, getBooksByUser); // Get all books by a user

// Routes for reviews
router.get('/:bookId/reviews', authenticateToken, getReviewsByBook); // Get reviews for a specific book
router.post('/:bookId/reviews', authenticateToken, addReview); // Add a review
router.put('/:bookId/reviews/:reviewId', authenticateToken, updateReview); // Update a review
router.delete('/:bookId/reviews/:reviewId', authenticateToken, deleteReview); // Delete a review
router.delete('/:bookId', authenticateToken, deleteBook); // Delete a book

export default router;
