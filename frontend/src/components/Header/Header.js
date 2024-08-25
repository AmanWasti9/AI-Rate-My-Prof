import React, { useState } from "react";
import "./Header.css";
import logo from "../../Image/logo.png";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDataDialog, setOpenDataDialog] = useState(false);
  const [url, setUrl] = useState("");
  const [scrapedData, setScrapedData] = useState({
    name: "",
    description: "",
    subject: "",
    department: "",
    university: "",
    courses_taught: "",
  });

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDataDialogClose = () => {
    setOpenDataDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/extract-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape the URL");
      }

      const data = await response.json();
      console.log(data);

      // Update state with the extracted information
      setScrapedData({
        name: data.extracted_information.name || "",
        description: data.extracted_information.description || "",
        subject: data.extracted_information.subject || "",
        department: data.extracted_information.department || "",
        university: data.extracted_information.university_name || "",
        courses_taught: data.extracted_information.courses_taught || "",
      });

      setOpen(false);
      setOpenDataDialog(true);
    } catch (error) {
      console.error("Error scraping data:", error);
      alert("Failed to scrape data. Please try again.");
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/add-professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ professor_info: scrapedData }), // Ensure the data is wrapped in `professor_info`
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to add professor");
      }

      alert("Professor added successfully!");
      // Clear the URL and scraped data
      setUrl("");
      setScrapedData({
        name: "",
        description: "",
        subject: "",
        department: "",
        university: "",
        courses_taught: "",
      });

      setOpenDataDialog(false);
    } catch (error) {
      console.error("Error adding professor:", error);
      alert("Failed to add professor. Please try again.");
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img
            src={logo}
            alt="AI"
            className="logo-img"
            style={{ width: "100px" }}
          />
          <h1>AI Rate My Professor</h1>
        </div>
        <button className="nav-toggle" onClick={toggleNav}>
          ☰
        </button>
        <nav className={`nav ${isNavOpen ? "active" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" style={{ textDecoration: "none" }}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a href="#" onClick={handleClickOpen}>
                Add New Prof
              </a>
            </li>
            <li className="nav-item">
              <Link to="/all-professors" style={{ textDecoration: "none" }}>
                Professors
              </Link>
            </li>
            <li className="nav-item">
              <a href="#signup" className="cta-button secondary">
                Sign Up
              </a>
            </li>
            <li className="nav-item">
              <a href="#login">Login</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* First Dialog for URL input */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            overflowX: "hidden",
            backgroundColor: "#fdf5e6",
            width: "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Fetch Professor Data via URL
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="Url"
            type="text"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "black", // Gradient from dark violet to purple
                },
                "&:hover fieldset": {
                  borderColor: "black", // Gradient from dark violet to purple
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
                color: "black",
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "var(--text-color)",
              backgroundColor: "var(--background-color)",
              border: "1px solid black",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: "var(--text-color)",
              color: "var(--background-color)",
              border: "none",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second Dialog for displaying and submitting scraped data */}
      <Dialog
        open={openDataDialog}
        onClose={handleDataDialogClose}
        PaperProps={{
          sx: {
            overflowX: "hidden",
            backgroundColor: "#fdf5e6",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Professor Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={scrapedData.name}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, name: e.target.value })
            }
          />

          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={scrapedData.description}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="subject"
            label="Subject"
            type="text"
            fullWidth
            value={scrapedData.subject}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, subject: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="department"
            label="Department"
            type="text"
            fullWidth
            value={scrapedData.department}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, department: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="university"
            label="University"
            type="text"
            fullWidth
            value={scrapedData.university}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, university: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="Courses"
            label="Courses"
            type="text"
            fullWidth
            value={scrapedData.courses_taught}
            onChange={(e) =>
              setScrapedData({ ...scrapedData, university: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDataDialogClose}
            sx={{ color: "var(--text-color)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFinalSubmit}
            style={{
              backgroundColor: "var(--background-color)",
              color: "var(--text-color)",
              border: "1px solid black",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
