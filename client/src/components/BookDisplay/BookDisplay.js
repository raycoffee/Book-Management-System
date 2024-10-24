import React from "react";
import "./BookDisplay.css";

const BookDisplay = ({ books, handleAddBook, recommended, header }) => {

  return (
    <>
      {header && (
        <div className="book-display-title">
          <h2>{header}</h2>
        </div>
      )}
      <div className="book-display-container">
        {books.map((book) => (
          <div
            className={`book-item${recommended ? "-recommended" : ""}`}
            key={book.id}
          >
            <img src={book.thumbnail} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h3 className="book-title">
                {book.title.split(" ").length > 20
                  ? book.title.split(" ").slice(0, 20).join(" ") + "..."
                  : book.title}
              </h3>
              <p className="book-author">
                by{" "}
                {book.author.split(" ").length > 20
                  ? book.author.split(" ").slice(0, 20).join(" ") + "..."
                  : book.author}
              </p>
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
    </>
  );
};

export default BookDisplay;
