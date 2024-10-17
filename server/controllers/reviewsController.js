import Book from '../models/Books.js';


export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find the book by its ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    const reviews = book.reviews;
    
    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
      : 0;

    // Return the reviews and average rating
    res.status(200).json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
};


export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { comment, rating } = req.body;
    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    // Ensure the comment and rating are provided
    if (!comment || !rating) {
      return res.status(400).json({ error: 'Comment and rating are required.' });
    }

    // Add the review using data from req.user and req.body
    const review = {
      userId: req.user.id,
      username: req.user.name, // Use name from the token
      rating,
      comment,
    };

    book.reviews.push(review); // Add the review to the book
    await book.save(); // Save the updated book

    res.status(201).json({ message: 'Review added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
};


// Update Review
export const updateReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    const review = book.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found.' });

    // Check if the user is the owner of the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this review.' });
    }

    // Update the review fields
    review.rating = rating;
    review.comment = comment;

    await book.save();
    res.status(200).json({ message: 'Review updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review.' });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    const review = book.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found.' });

    // Check if the user is the owner of the review
    if (!review.userId.equals(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized to delete this review.' });
    }

    // Remove the review from the reviews array
    book.reviews.pull(reviewId);

    await book.save();
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
};
