import express from 'express';
import { register, login } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { updateFavoriteGenres } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/:userId/genres', authenticateToken, updateFavoriteGenres);
export default router;
