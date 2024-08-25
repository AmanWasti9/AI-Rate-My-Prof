import React from "react";
import "./FeaturesSection.css";
import { FaUserAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaChartBar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { IoChatbubbleEllipses } from "react-icons/io5";

const FeaturesSection = () => {
  return (
    <section className="features">
      <div className="features-content">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              {/* <i className="fas fa-star"></i> */}
              <FaStar />
            </div>
            <h3 className="feature-heading">AI-Driven Insights</h3>
            <p className="feature-description">
              Get precise ratings and reviews based on sentiment analysis of
              your review messages.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              {/* <i className="fas fa-users"></i> */}
              <FaUserAlt />
            </div>
            <h3 className="feature-heading">Student Reviews</h3>
            <p className="feature-description">
              Read and share experiences with a vibrant academic community.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              {/* <i className="fas fa-search"></i> */}
              <IoSearch />
            </div>
            <h3 className="feature-heading">Easy Search</h3>
            <p className="feature-description">
              Quickly find professors based on various filters and criteria.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              {/* <i className="fas fa-chart-line"></i> */}
              <IoChatbubbleEllipses />
            </div>
            <h3 className="feature-heading">Chat with Our Knowledge Base</h3>
            <p className="feature-description">
              Interact with our custom chatbot to get answers about professor
              data and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
