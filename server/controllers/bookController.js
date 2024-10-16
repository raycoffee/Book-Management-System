import Book from '../models/Books.js';

export const addBook = async (req, res) => {
  try {
    const { title, author, published_date, ISBN, genre, thumbnail } = req.body;

    const book = new Book({
      title,
      author,
      published_date,
      ISBN,
      genre,
      thumbnail,
      userId: req.user.id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book.' });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.params.userId });
    res.json(books);
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
