import React from "react";
import "./AboutSection.css";
import { RiTeamFill } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { GiSubmarineMissile } from "react-icons/gi";
import EyeAnimation from "../Animations/EyeAnimation/EyeAnimation";

const AboutSection = () => {
  return (
    <section className="about">
      <div className="about-content">
        <h2 className="about-title">About Us</h2>
        <p className="about-description">
          At <strong>AI Rate My Professor</strong>, we leverage cutting-edge
          artificial intelligence to provide accurate and insightful ratings for
          academic professionals. Our mission is to empower students with the
          information they need to make informed decisions about their
          education.
        </p>
        <div className="about-info">
          <div className="info-item">
            <GiSubmarineMissile
              className="animated-icon"
              style={{
                fontSize: "50px",
              }}
            />
            <h3 className="info-heading">Our Mission</h3>
            <p className="info-text">
              To enhance the academic experience by offering a platform that
              combines AI technology with community feedback to rate and review
              professors effectively.
            </p>
          </div>
          <div className="info-item">
            {/* <IoEye
              style={{
                fontSize: "50px",
              }}
            /> */}
            {/* <EyeAnimation /> */}
            <p class="icon">✨</p>

            <h3 className="info-heading">Our Vision</h3>
            <p className="info-text">
              To be the leading resource for students seeking detailed and
              reliable professor ratings, fostering an informed and engaged
              academic community.
            </p>
          </div>
          <div className="info-item">
            <RiTeamFill
              style={{
                fontSize: "50px",
              }}
            />
            <h3 className="info-heading">Our Team</h3>
            <p className="info-text">
              Our team consists of experts in AI, data science, and education
              who are dedicated to creating the most accurate and user-friendly
              platform for our users.
            </p>
            <p className="info-text">
              We are{" "}
              <strong>
                A<sup>3</sup>
              </strong>{" "}
              — Amanullah, Ahmed, and Asfand. United by our shared vision, we're
              combining our skills to bring this project to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
