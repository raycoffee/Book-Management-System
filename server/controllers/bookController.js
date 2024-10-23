import Book from "../models/Books.js";
import UserBook from "../models/UserBooks.js";
import Review from "../models/Reviews.js";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();
export const getBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the book." });
  }
};

export const addBookForUser = async (req, res) => {
  try {
    const { title, author, published_date, ISBN, genre, thumbnail } = req.body;

    let book = await Book.findOne({ ISBN });
    if (!book) {
      book = new Book({
        title,
        author,
        published_date,
        ISBN,
        genre,
        thumbnail,
      });
      await book.save();
    }

    const userBookExists = await UserBook.findOne({
      userId: req.user.id,
      bookId: book._id,
    });

    if (userBookExists) {
      return res.status(400).json({ error: "You already added this book." });
    }

    const userBook = new UserBook({
      userId: req.user.id,
      bookId: book._id,
    });

    await userBook.save();
    res.status(201).json(userBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const userBooks = await UserBook.find({ userId: req.user._id })
      .populate("bookId")
      .populate("reviewId");

    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve books." });
  }
};

export const deleteBookByUser = async (req, res) => {
  try {
    const { bookId } = req.params;

    const userBook = await UserBook.findOne({ userId: req.user._id, bookId });

    if (!userBook) {
      return res.status(404).json({ error: "User does not have this book." });
    }

    if (userBook.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this user book entry." });
    }

    await UserBook.findOneAndDelete({ userId: req.user._id, bookId });

    await Review.findOneAndDelete({ userId: req.user._id, bookId });

    res.status(200).json({
      message: "Book entry deleted successfully from user's collection.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user book entry." });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const filteredResults = response.data.items.map((book) => {
      const {
        title,
        authors,
        publishedDate,
        industryIdentifiers,
        categories,
        imageLinks,
      } = book.volumeInfo;

      return {
        id: book.id,
        title: title || "No title available",
        author: authors?.join(", ") || "Unknown",
        published_date: publishedDate || "N/A",
        ISBN: industryIdentifiers?.[0]?.identifier || "N/A",
        genre: categories?.[0] || "Unknown",
        thumbnail: imageLinks?.thumbnail || "https://via.placeholder.com/150",
      };
    });

    res.json(filteredResults || []);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
};
