import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.js";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import SelectGenres from "./pages/SelectGenres/SelectGenres.js";
import MyBooks from "./pages/MyBooks/MyBooks";
import Navbar from "./components/Navbar/Navbar.js";
import AuthProvider from "./context/AuthContext.js";
import AddBook from "./pages/AddBook/AddBook.js";
import BookDetails from "./pages/BookDetails/BookDetails.js";
import ReviewMatrix from "./pages/ReviewMatrix/ReviewMatrix.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/select-genres" element={<SelectGenres />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/book/:bookId" element={<BookDetails />} />
          <Route path="/review-matrix" element={<ReviewMatrix />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
