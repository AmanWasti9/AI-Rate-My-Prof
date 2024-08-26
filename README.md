# AI Rate My Professor

## Overview

"AI Rate My Professor" is a web application designed to evaluate and compare professors based on user reviews and sentiment analysis. The application is built with a React.js frontend and a Python backend. It allows users to extract professor information from URLs, rate professors based on sentiment analysis of their reviews, compare professors side by side, and interact with a custom knowledge base chatbot to ask questions about the professors.

## Features

- **Professor Information Extraction**: Extracts professor details from a provided URL and saves the information in a JSON file.
- **Sentiment Analysis Rating**: Allows users to review any professor and rates them on a scale from 1 to 5 based on sentiment analysis of the review message.
- **Side-by-Side Comparison**: Provides functionality to compare two professors side by side based on various metrics.
- **Custom Knowledge Base Chatbot**: Includes a chatbot that answers questions about the professors using a custom knowledge base.

## Technologies

- **Frontend**: React.js
- **Backend**: Python
- **Sentiment Analysis**: Utilizes sentiment analysis libraries to rate reviews
- **Data Storage**: JSON files for storing professor information

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.x (for backend)
- Libraries for sentiment analysis (e.g., `TextBlob`, `VADER`)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/AmanWasti9/AI-Rate-My-Prof
    cd ai-rate-my-professor
    ```

2. **Frontend Setup**

    Navigate to the `frontend` directory and install dependencies:

    ```bash
    cd frontend
    npm install
    ```

    Start the React development server:

    ```bash
    npm start
    ```

3. **Backend Setup**

    Navigate to the `backend` directory and install dependencies:

    ```bash
    cd backend
    pip install -r requirements.txt
    ```

    Run the Python server:

    ```bash
    python app.py
    ```

### Usage

1. **Extract Professor Information**

    - Enter a URL containing professor details and click the "Extract Information" button.
    - The information will be saved in a JSON file.

2. **Review and Rate a Professor**

    - Use the "Rate Professor" button to submit a review.
    - The sentiment of the review will be analyzed and a rating (1-5) will be assigned.

3. **Compare Professors**

    - Use the "Compare Professors" button to select two professors for side-by-side comparison.

4. **Chat with the Knowledge Base**

    - Use the custom chatbot interface to ask questions about professors and get responses from the knowledge base.

## Acknowledgements

- **Ahmed**: For his invaluable contributions to the development and testing of the project.
- **Asfand**: For his expertise and support in integrating the chatbot functionality and refining the user experience.

We also want to thank the open-source communities and tools that made this project possible. Your contributions are greatly appreciated!

