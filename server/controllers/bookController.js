import Book from '../models/Books.js';
import UserBook from '../models/userBooks.js';

export const addBookForUser = async (req, res) => {
  try {
    const { title, author, published_date, ISBN, genre, thumbnail } = req.body;
console.log(req.body);
    // Check if the book already exists by ISBN
    let book = await Book.findOne({ ISBN });
    if (!book) {
      // If the book doesn't exist, create a new one
      book = new Book({ title, author, published_date, ISBN, genre, thumbnail });
      await book.save();
    }

    // Check if the user already has this book in their collection
    const userBookExists = await UserBook.findOne({
      userId: req.user.id,
      bookId: book._id,
    });

    if (userBookExists) {
      return res.status(400).json({ error: 'You already added this book.' });
    }

    // Associate the book with the user
    const userBook = new UserBook({
      userId: req.user.id,
      bookId: book._id,
    });

    await userBook.save();
    res.status(201).json(userBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book.' });
  }
};

// export const addBook = async (req, res) => {
//   try {
//     const { title, author, published_date, ISBN, genre, thumbnail } = req.body;

//     const book = new Book({
//       title,
//       author,
//       published_date,
//       ISBN,
//       genre,
//       thumbnail,
//       userId: req.user.id,
//     });

//     await book.save();
//     res.status(201).json(book);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add book.' });
//   }
// };

export const getBooksByUser = async (req, res) => {
  try {
    const userBooks = await UserBook.find({ userId: req.params.userId }).populate('bookId');
    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books.' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    // Check if the user is the owner of the book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this book.' });
    }

    await book.remove();
    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book.' });
  }
};
