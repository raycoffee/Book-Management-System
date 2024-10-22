import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { recommendBooks, predictRatings } from "../controllers/matrixOperationsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/matrix", authenticateToken, predictRatings, recommendBooks);
router.get("/:userId", getRecommendations);

export default router;
