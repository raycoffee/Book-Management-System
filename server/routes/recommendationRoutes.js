import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { recommendBooks } from "../controllers/matrixOperationsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/:userId", getRecommendations);
router.get("/matrix", authenticateToken, recommendBooks);

export default router;
