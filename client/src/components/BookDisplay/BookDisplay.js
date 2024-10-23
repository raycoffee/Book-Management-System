import React from "react";
import "./BookDisplay.css";

const BookDisplay = ({ books, handleAddBook, recommended }) => {
  return (
    <div className="book-display-container">
      {books.map((book) => (
        <div
          className={`book-item${recommended ? "-recommended" : ""}`}
          key={book.id}
        >
          <img src={book.thumbnail} alt={book.title} className="book-cover" />
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            <p className="book-genre">
              <b>{book.genre}</b>
            </p>
          </div>
          <button className="add-button" onClick={() => handleAddBook(book)}>
            Add Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookDisplay;
