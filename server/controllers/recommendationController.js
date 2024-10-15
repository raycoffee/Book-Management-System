import Book from '../models/Books.js';
import Review from '../models/Reviews.js';

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const userReviews = await Review.find({ userId }).populate('bookId');
    const genres = userReviews.map((review) => review.bookId.genre);

    const recommendations = await Book.find({ genre: { $in: genres } });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
