import express from "express";
import {
  addBookForUser,
  getBooksByUser,
  deleteBookByUser,
  getBook,
  searchBooks,
  getBookDetails,
searchBooksByGenre
} from "../controllers/bookController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticateToken, searchBooks)
router.get("/search-genre", authenticateToken, searchBooksByGenre)
router.get("/get-details", getBookDetails)

router.post("/user", authenticateToken, addBookForUser);
router.get("/user", authenticateToken, getBooksByUser);
router.delete("/user/:bookId", authenticateToken, deleteBookByUser);

router.get("/:bookId", authenticateToken, getBook)


export default router;

