import express from "express";
import {
  getReviewsByBook,
  addReview,
  updateReview,
  deleteReview,
  getReviewsByBookAuth,
} from "../controllers/reviewsController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:bookId", getReviewsByBook);
router.get("/auth/:bookId", authenticateToken, getReviewsByBookAuth);

router.post("/:bookId", authenticateToken, addReview);

router.put("/:reviewId", authenticateToken, updateReview);

router.delete("/:reviewId", authenticateToken, deleteReview);

export default router;
