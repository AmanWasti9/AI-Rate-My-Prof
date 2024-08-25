import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { MdRateReview, MdCompare } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red"];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function SingleProfessor() {
  const location = useLocation();
  const { professor } = location.state || { professor: null };
  const [open, setOpen] = useState(false); // State for dialog open/close
  const [rating, setRating] = useState(""); // State for rating input
  const [ratingMessage, setRatingMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [reviews, setReviews] = useState(professor?.reviews || []); // Initialize reviews as an empty array if undefined

  // Function to fetch professor data
  const fetchProfessorData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/professor/${professor.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []); // Ensure reviews is set to an empty array if undefined
        console.log(data); // Log professor data to console
      } else {
        console.error("Error fetching professor data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProfessorData();
  }, [professor.id]);

  if (!professor) {
    return <div>No professor data available</div>;
  }

  const calculateAverageRating = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const reviewData = {
      professor_name: professor.name,
      student_name: studentName,
      rating: rating,
      rating_message: ratingMessage,
    };

    fetch("http://localhost:5000/submit-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          fetchProfessorData(); // Fetch the updated reviews after submitting
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Clear the form fields
    setStudentName("");
    setRating("");
    setRatingMessage("");

    // Close the dialog after submission
    setOpen(false);
  };

  const calculateChartData = () => {
    const counts = [0, 0, 0, 0, 0]; // Initialize counts for each rating (1 to 5)
    if (!Array.isArray(reviews)) return counts;

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });

    // Create the chart data array based on counts
    return [
      { name: "Fair", count: counts[0] },
      { name: "Okay", count: counts[1] },
      { name: "Good", count: counts[2] },
      { name: "Great", count: counts[3] },
      { name: "Awesome", count: counts[4] },
    ];
  };

  return (
    <div>
      <Container>
        <Grid
          container
          spacing={2}
          sx={{
            padding: "50px 0px",
          }}
        >
          <Grid item xs={12} md={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "100px", fontWeight: "bold" }}>
                {calculateAverageRating()} {/* Use the dynamic rating */}
              </span>
              <sup style={{ fontSize: "20px", fontWeight: "bold" }}> / 5</sup>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <span>Overall Ratings Based on {reviews.length} students</span>
              <span style={{ fontSize: "50px", fontWeight: "bold" }}>
                {professor.name}
              </span>
              <span>
                Professor in the {professor.department} department at{" "}
                {professor.university}
              </span>
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <button
                style={{
                  backgroundColor: "var(--text-color)",
                  color: "var(--background-color)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={handleClickOpen} // Open dialog on click
              >
                <MdRateReview />
                Rate
              </button>
              <Link
                to={"/compare/" + professor.id}
                style={{
                  backgroundColor: "var(--text-color)",
                  textDecoration: "none",
                  color: "var(--background-color)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <MdCompare />
                Compare
              </Link>
            </div>
          </Grid>

          <Grid item xs={12} md={6} style={{ height: "50vh" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculateChartData()} // Pass dynamic chart data
                margin={{ top: 20, right: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  shape={<TriangleBar />}
                  label={{ position: "top" }}
                >
                  {calculateChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <div>
              {/* Display the review of that professor */}
              <h1>Reviews</h1>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: "var(--info-bg)",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    key={review.id}
                  >
                    <p>
                      <strong>Name:</strong> {review.student_name}
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.comment}
                    </p>
                    <p>
                      <strong>Rating Based On Sentiment Analysis:</strong>{" "}
                      {review.rating}/5
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for adding review */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "#fdf5e6",
          },
        }}
      >
        <DialogTitle>Rate {professor.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <FormControl component="fieldset" sx={{ marginTop: 2 }}>
            <FormLabel component="legend">Rating</FormLabel>
            <RadioGroup
              aria-label="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Fair" />
              <FormControlLabel value={2} control={<Radio />} label="Ok" />
              <FormControlLabel value={3} control={<Radio />} label="Good" />
              <FormControlLabel value={4} control={<Radio />} label="Great" />
              <FormControlLabel value={5} control={<Radio />} label="Awesome" />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            id="review"
            label="Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={ratingMessage}
            onChange={(e) => setRatingMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ color: "var(--text-color)", border: "1px solid black" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: "var(--text-color)",
              color: "var(--background-color)",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
