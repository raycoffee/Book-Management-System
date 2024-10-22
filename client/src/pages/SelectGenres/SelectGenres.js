import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Checkbox,
  Typography,
  Button,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./SelectGenres.css";

const genres = [
  "Art",
  "Biography",
  "Business",
  "Fantasy",
  "History",
  "Horror",
  "Comics",
  "Manga",
  "Music",
  "Philosophy",
  "Romance",
  "Science Fiction",
  "Self Help",
  "Thriller",
  "Young Adult",
  "Mystery",
  "Poetry",
  "Nonfiction",
];

function SelectGenres() {
  const { isLoggedIn } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/v1/users/genres`,
        { favoriteGenres: selectedGenres },
        { withCredentials: true }
      );

      navigate("/books");
    } catch (error) {
      console.error("Failed to save favorite genres:", error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Container maxWidth="md" style={{ marginTop: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Select Your Favorite Genres
          </Typography>
          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            {genres.map((genre) => (
              <Grid item xs={6} sm={4} md={3} key={genre}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleCheckboxChange(genre)}
                    />
                  }
                  label={genre}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "2rem" }}
            disabled={selectedGenres.length === 0}
          >
            Save and Continue
          </Button>
        </Container>
      ) : (
        <button className="primary-button" onClick={() => navigate("/signin")}>
          Sign In to Continue
        </button>
      )}
    </>
  );
}

export default SelectGenres;
