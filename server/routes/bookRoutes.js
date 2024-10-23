import express from "express";
import {
  addBookForUser,
  getBooksByUser,
  deleteBookByUser,
  getBook,
  searchBooks
} from "../controllers/bookController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticateToken, searchBooks); // Add this new route

router.post("/user", authenticateToken, addBookForUser);
router.get("/user", authenticateToken, getBooksByUser);
router.delete("/user/:bookId", authenticateToken, deleteBookByUser);

router.get("/:bookId", authenticateToken, getBook)


export default router;

