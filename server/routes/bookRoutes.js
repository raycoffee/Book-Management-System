import express from 'express';
import Book from '../models/Books.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, author, published_date, ISBN, genre, thumbnail } = req.body;
    
    const book = new Book({
      title,
      author,
      published_date,
      ISBN,
      genre,
      thumbnail, // Save the thumbnail in the book document
      userId: req.user.id, // Associate the book with the logged-in user
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book.' });
  }
});

// Get books for the logged-in user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.params.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books.' });
  }
});

export default router;
