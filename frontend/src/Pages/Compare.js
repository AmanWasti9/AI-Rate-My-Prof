import { Container, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdGitCompare } from "react-icons/io";

export default function Compare() {
  const { id } = useParams(); // Get the professor ID from the URL
  const [professor, setProfessor] = useState(null);
  const [professors, setProfessors] = useState([]); // State to hold professors' data
  const [selectedProfessor, setSelectedProfessor] = useState(null); // State for selected professor
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    // Function to fetch professor data
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/professor/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProfessor(data); // Store professor data in state
          console.log(data); // Log professor data to console
        } else {
          console.error("Error fetching professor data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessorData();
  }, [id]);

  useEffect(() => {
    // Function to fetch professors' data
    const fetchProfessorsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/test.json");
        if (response.ok) {
          const data = await response.json();
          const professorsList = data.professors || []; // Extract professors array
          setProfessors(professorsList); // Store professors data in state
        } else {
          console.error("Error fetching professors data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessorsData();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Click handler to set the selected professor
  const handleProfessorClick = (professor) => {
    setSelectedProfessor(professor);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter professors based on the search term
  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Container>
        <Grid
          container
          spacing={2}
          style={{
            padding: "50px 0px",
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            style={{
              backgroundColor: "var(--info-bg)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            <div>
              {/* Optionally display some professor data */}
              {professor ? (
                <div>
                  <h1>{professor.name}</h1>
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    {calculateAverageRating(professor.reviews)}
                  </p>
                  <p>
                    <strong>Department:</strong> {professor.department}
                  </p>
                  <p>
                    <strong>University:</strong> {professor.university}
                  </p>
                  <p>
                    <strong>Courses Taught:</strong> {professor.courses_taught}
                  </p>
                </div>
              ) : (
                <p>Loading professor data...</p>
              )}
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IoMdGitCompare
              style={{
                fontSize: "150px",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{
              backgroundColor: "var(--info-bg)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            {selectedProfessor && (
              <div>
                <h1>{selectedProfessor.name}</h1>
                <p>
                  <strong>Average Rating:</strong>{" "}
                  {calculateAverageRating(selectedProfessor.reviews)}
                </p>
                <p>
                  <strong>Department:</strong> {selectedProfessor.department}
                </p>
                <p>
                  <strong>University:</strong> {selectedProfessor.university}
                </p>
                <p>
                  <strong>Courses Taught:</strong>{" "}
                  {selectedProfessor.courses_taught}
                </p>
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <div>
              <h2>All Professors</h2>
              <TextField
                label="Search Professors"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: "16px" }}
              />
              {filteredProfessors.length > 0 ? (
                filteredProfessors.map((prof) => (
                  <div
                    key={prof.id} // Use professor ID as key
                    style={{
                      padding: "10px",
                      margin: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: "var(--info-bg)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleProfessorClick(prof)} // Handle click event
                  >
                    {prof.name}
                  </div>
                ))
              ) : (
                <p>No professors found.</p>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
