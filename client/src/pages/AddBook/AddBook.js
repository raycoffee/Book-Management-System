import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AddBook.css';  // Import the CSS file

const AddBook = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  
  const { isLoggedIn } = useContext(AuthContext);
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_GOOGLE_API_KEY}&q=${searchQuery}`
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error fetching books from Google Books API:', error);
    }
  };

  const handleAddBook = async (book) => {
    const { title, authors, publishedDate, industryIdentifiers, imageLinks, categories } = book.volumeInfo;

    const newBook = {
      title,
      author: authors?.join(', ') || 'Unknown',
      published_date: publishedDate || 'N/A',
      ISBN: industryIdentifiers?.[0]?.identifier || 'N/A',
      genre: categories?.[0] || 'Unknown',
      thumbnail: imageLinks?.thumbnail || 'https://via.placeholder.com/150',
    };

    try {
      await axios.post(
        'http://localhost:3001/api/v1/books/user',
        newBook,
        { withCredentials: true }
      );
      alert('Book added successfully!');
      navigate('/my-books');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h2 className="error">You need to be logged in to add books.</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="heading">Search and Add a Book</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for Books"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="grid">
        {searchResults.map((book) => (
          <div className="card" key={book.id}>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
              alt={book.volumeInfo.title}
              className="card-img"
            />
            <div className="card-content">
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
              <p>Genre: {book.volumeInfo.categories?.[0] || 'Unknown'}</p>
            </div>
            <button className="add-button" onClick={() => handleAddBook(book)}>Add Book</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddBook;
