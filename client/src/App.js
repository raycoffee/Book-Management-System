import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SelectGenres from './pages/SelectGenres';
import MyBooks from './pages/MyBooks';
import Navbar from './components/Navbar';
import AuthProvider from './context/AuthContext';
import AddBook from './pages/AddBook';
function App() {
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
