import Book from "../models/Books.js";
import UserBooks from "../models/UserBooks.js";
import Review from "../models/Reviews.js";
import UserBookMatrix from "../models/UserBookMatrix.js";

export const getReviewsByBookAuth = async (req, res) => {
  console.log('Am i hit?')
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found." });

    const allReviews = await Review.find({ bookId });

    const userReview = allReviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    const communityReviews = allReviews.filter(
      (review) => review.userId.toString() !== req.user._id.toString()
    );

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, review) => acc + review.rating, 0) /
          allReviews.length
        : 0;

    // Send the response with all necessary data
    res.status(200).json({
      reviews: communityReviews, 
      averageRating,
      totalReviews: allReviews.length, 
      userReview, 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reviews." });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found." });

    const reviews = await Review.find({ bookId });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    res.status(200).json({
      reviews,
      averageRating,
      totalReviews: reviews.length,
      userReview: null,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reviews." });
  }
};

export const addReview = async (req, res) => {

  try {
    const { bookId } = req.params;
    const { comment, rating } = req.body;

    const userBook = await UserBooks.findOne({ userId: req.user._id, bookId });

    if (!userBook)
      return res.status(404).json({ error: "User does not have this book." });

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ error: "Comment and rating are required." });
    }

    const review = new Review({
      bookId,
      userId: req.user.id,
      username: req.user.name,
      rating,
      comment,
    });

    await review.save();


    userBook.reviewId = review._id;
    await userBook.save();

    res.status(201).json({ message: "Review added successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      userId: req.user._id,
    });

    if (!review) {
      return res
        .status(404)
        .json({ error: "Review not found or not owned by the user." });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully.", review });
  } catch (error) {
    res.status(500).json({ error: "Failed to update review." });
  }
};

export const deleteReview = async (req, res) => {
  console.log(1098)
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      userId: req.user._id,
    });

    if (!review) {
      return res
        .status(404)
        .json({ error: "Review not found or not owned by the user." });
    }

    await Review.findByIdAndDelete(reviewId);

    await UserBooks.updateOne(
      { userId: req.user._id, reviewId: reviewId },
      { $unset: { reviewId: "" } }
    );

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review." });
  }
};
