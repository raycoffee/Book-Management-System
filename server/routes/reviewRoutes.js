import express from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/', getReviews); // Public route
router.delete('/:id', authenticateToken, deleteReview);

export default router;
