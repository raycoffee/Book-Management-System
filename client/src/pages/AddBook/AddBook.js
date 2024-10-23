import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookDisplay from "../../components/BookDisplay/BookDisplay";
import "./AddBook.css";

const AddBook = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/recommendations/matrix`,
          {
            withCredentials: true,
          }
        );

        setRecommendations(response.data.map(x => x.book));
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecommendation();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_GOOGLE_API_KEY}&q=${searchQuery}`
      );

      const filteredRes = response.data.items.map((book) => {
        const {
          title,
          authors,
          publishedDate,
          industryIdentifiers,
          categories,
          imageLinks,
        } = book.volumeInfo;

        console.log(response.data, '😻')

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

      setSearchResults(filteredRes || []);
    } catch (error) {
      console.error("Error fetching books from Google Books API:", error);
    }
  };

  const handleAddBook = async (book) => {
    const { title, author, published_date, ISBN, genre, thumbnail } = book;

    const newBook = {
      title,
      author: author || "Unknown",
      published_date: published_date || "N/A",
      ISBN: ISBN || "N/A",
      genre: genre || "Unknown",
      thumbnail: thumbnail || "https://via.placeholder.com/150",
    };

    try {
      await axios.post("http://localhost:3001/api/v1/books/user", newBook, {
        withCredentials: true,
      });
      alert("Book added successfully!");
      navigate("/my-books");
    } catch (error) {
      console.error("Error adding book:", error);
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

      <BookDisplay books={recommendations} handleAddBook={handleAddBook} />
      <BookDisplay books={searchResults} handleAddBook={handleAddBook} />
    </div>
  );
};

export default AddBook;
