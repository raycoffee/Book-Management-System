import UserBookMatrix from "../models/UserBookMatrix.js";
import Book from "../models/Books.js";
import Review from "../models/Reviews.js";
import {
  cosineSimilarity,
  pearsonCorrelation,
  cosineSimilarityDistance,
} from "./mathController.js";

export const addReviewToMatrix = async (userId, bookId, reviewId) => {
  const userMatrix = await UserBookMatrix.findOne({ userId });

  if (userMatrix) {
    userMatrix.ratings.push({ bookId, reviewId });
    await userMatrix.save();
  } else {
    const newMatrix = new UserBookMatrix({
      userId,
      ratings: [{ bookId, reviewId }],
    });

    await newMatrix.save();
  }
};

export const removeReviewFromMatrix = async (userId, bookId) => {
  try {
    const userMatrix = await UserBookMatrix.findOne({ userId });

    if (userMatrix) {
      userMatrix.ratings = userMatrix.ratings.filter(
        (rating) => rating.bookId.toString() !== bookId.toString()
      );
      await userMatrix.save();
    }
  } catch (error) {
    console.error("Error removing review from matrix:", error);
    throw error;
  }
};

export const getUserRatings = async (userId) => {
  const userMatrix = await UserBookMatrix.findOne({ userId }).populate(
    "ratings.reviewId"
  );

  if (!userMatrix) return null;

  return userMatrix.ratings.map((ratings) => {
    return {
      bookId: ratings.bookId,
      rating: ratings.reviewId.rating,
    };
  });
};

export const calculateSimilarity = async (currUserId, otherUserId) => {
  const currUserRatings = await getUserRatings(currUserId);
  const otherUserRatings = await getUserRatings(otherUserId);

  const ratings1 = [];
  const ratings2 = [];

  currUserRatings?.forEach((currUserRating) => {
    const sameBookRating = otherUserRatings.find((otherUserRating) => {
      return (
        otherUserRating.bookId.toString() === currUserRating.bookId.toString()
      );
    });
    if (sameBookRating) {
      ratings1.push(currUserRating.rating);
      ratings2.push(sameBookRating.rating);
    }
  });

  if (ratings1.length > 0) {
    return cosineSimilarityDistance(ratings1, ratings2);
  } else return 0;
};

export const findSimilarUsers = async (currUserId) => {
  const allUsers = await UserBookMatrix.find({ userId: { $ne: currUserId } });

  const similarities = [];

  for (let otherUsers of allUsers) {
    const similarity = await calculateSimilarity(currUserId, otherUsers.userId);
    if (similarity > 0) {
      similarities.push({ userId: otherUsers.userId, similarity });
    }
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities;
};

export const predictRatings = async (req, res, next) => {
  try {
    const similarUsers = await findSimilarUsers(req.user._id);

    if (similarUsers.length === 0) {
      return res.status(200).json([]); // Use return to prevent further execution
    }

    const currUserRatings = await getUserRatings(req.user._id);

    let currUserBookIds = currUserRatings?.map((rating) => {
      return rating.bookId.toString();
    }) || [];

    const predectiveRatings = {};

    for (let similarUser of similarUsers) {
      const similarUserRatings = await getUserRatings(similarUser.userId);

      similarUserRatings.forEach((review) => {
        const bookId = review.bookId.toString();
        if (!currUserBookIds.includes(bookId)) {
          const weight = similarUser.similarity;
          const weightedRating = review.rating * weight;

          if (!predectiveRatings[bookId]) {
            predectiveRatings[bookId] = [0, 0];
          }
          predectiveRatings[bookId][0] += weightedRating;
          predectiveRatings[bookId][1] += Number(weight);
        }
      });
    }

    for (let bookId of Object.keys(predectiveRatings)) {
      const numerator = predectiveRatings[bookId][0];
      const denominator = predectiveRatings[bookId][1];

      predectiveRatings[bookId] = numerator / denominator;
    }

    req.predectiveRatings = predectiveRatings;
    next();
  } catch (error) {
    next(error); // Pass errors to error handler
  }
};

export const recommendBooks = async (req, res, next) => {
  try {
    const { predectiveRatings } = req;
    
    if (!predectiveRatings) {
      return res.status(400).json({ error: "No predictive ratings available" });
    }

    const recommendedBooks = [];

    for (let bookId of Object.keys(predectiveRatings)) {
      const book = await Book.findById(bookId);
      if (!book) continue;

      recommendedBooks.push({
        book,
        predictiveRating: predectiveRatings[bookId],
      });
    }

    recommendedBooks.sort((a, b) => {
      return b.predictiveRating - a.predictiveRating;
    });

    return res.status(200).json(recommendedBooks);
  } catch (error) {
    next(error); // Pass errors to error handler
  }
};
