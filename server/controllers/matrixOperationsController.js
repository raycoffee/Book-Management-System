import { reviewSchema } from "../models/Reviews.js";
import UserBookMatrix from "../models/UserBookMatrix.js";
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

export const removeReviewFromMatix = async (userId, bookId) => {
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

  currUserRatings.forEach((currUserRating) => {
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

export const recommendBooks = async (req, res) => {
  const similarUsers = await findSimilarUsers(req.user._id);

  if (similarUsers.length == 0) {
    res.status(200).json([]);
  }

  const currUserRatings = await getUserRatings(req.user._id);

  const currUserBookIds = currUserRatings.map((rating) => {
    return rating.bookId.toString();
  });

  const predectiveRatings = {};

  for (let similarUser of similarUsers) {
    const similarUserRatings = await getUserRatings(similarUser.userId);

    similarUserRatings.forEach((review) => {
      const bookId = review.bookId.toString();
      if (!currUserBookIds.includes(review.bookId.toString())) {
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

  for (let ratings of Object.keys(predectiveRatings)) {
    const numerator = predectiveRatings[ratings][0];
    const denominator = predectiveRatings[ratings][1];

    predectiveRatings[ratings] = numerator / denominator;
  }

  res.status(200).json({ predectiveRatings });
};
