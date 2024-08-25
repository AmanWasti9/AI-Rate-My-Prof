import {
  Container,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedProfessor, setHighlightedProfessor] = useState(null);
  const professorRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/test.json")
      .then((response) => response.json())
      .then((data) => setProfessors(data.professors))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = professors.filter((professor) =>
        professor.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (professor) => {
    setHighlightedProfessor(professor.id);
    setSearchTerm(professor.name);
    setSuggestions([]);

    if (professorRefs.current[professor.id]) {
      professorRefs.current[professor.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleProfessorClick = (professor) => {
    navigate("/professor", { state: { professor } });
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div
      style={{
        padding: "50px 0px",
      }}
    >
      <Container>
        <TextField
          fullWidth
          label="Search Professors"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          style={{ marginBottom: "20px" }}
        />

        {suggestions.length > 0 && (
          <List
            style={{
              position: "absolute",
              backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            {suggestions.map((professor) => (
              <ListItem
                button
                key={professor.id}
                onClick={() => handleSuggestionClick(professor)}
              >
                <ListItemText primary={professor.name} />
              </ListItem>
            ))}
          </List>
        )}

        <h1>All Professors</h1>
        {professors.map((professor) => (
          <div
            key={professor.id}
            ref={(el) => (professorRefs.current[professor.id] = el)}
            onClick={() => handleProfessorClick(professor)}
            style={{
              padding: "20px 40px",
              marginBottom: "20px",
              backgroundColor:
                highlightedProfessor === professor.id
                  ? "lightyellow"
                  : "var(--info-bg)",
              cursor: "pointer",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <h2>{professor.name}</h2>
                <p>
                  <strong>Department:</strong> {professor.department}
                </p>
                <p>
                  <strong>University:</strong> {professor.university}
                </p>
                <p>
                  <strong>Overall Rating:</strong>{" "}
                  {calculateAverageRating(professor.reviews)}
                </p>
              </Grid>
              <Grid item xs={12} md={6}>
                <h3>Courses Taught:</h3>
                <p>{professor.courses_taught}</p>
              </Grid>
            </Grid>
          </div>
        ))}
      </Container>
    </div>
  );
}
