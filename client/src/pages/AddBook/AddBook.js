import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate,useSearchParams  } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookDisplay from "../../components/BookDisplay/BookDisplay";
import "./AddBook.css";

const API_URL = process.env.REACT_APP_API_URL;

const AddBook = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);


  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/recommendations/matrix`,
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

    const query = searchParams.get("q");
    if (query) {
      handleSearch(query);
    }
  }, []);

  const handleSearch = async (queryParam = searchQuery) => {
    if (!queryParam) return;
    
    try {

      const encodedQuery = encodeURIComponent(queryParam);
      const response = await axios.get(
        `${API_URL}/api/v1/books/search?q=${encodedQuery}`,
        { withCredentials: true }
      );
      setSearchResults(response.data);
      
      // Update URL with encoded search query
      setSearchParams({ q: queryParam });
    } catch (error) {
      console.error("Error fetching books:", error);
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
      await axios.post("${API_URL}/api/v1/books/user", newBook, {
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
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button onClick={() => handleSearch()}>Search</button>
    </div>

      <BookDisplay books={recommendations} handleAddBook={handleAddBook} />
      <BookDisplay books={searchResults} handleAddBook={handleAddBook} />
    </div>
  );
};

export default AddBook;
