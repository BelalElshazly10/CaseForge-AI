# CaseForge AI

### AI-Powered Automated Quality Assurance Testing System

**CaseForge AI** is my university graduation project, developed to support and automate key activities in the Software Quality Assurance (QA) process using Artificial Intelligence.

The system analyzes software requirements, assists in generating test cases, and produces software documentation using Google Gemini AI.

---

## Project Overview

Software testing is an essential part of software development. However, analyzing requirements, preparing test cases, and producing documentation can be time-consuming.

CaseForge AI aims to simplify these activities through an AI-powered platform that connects a React frontend with a Flask backend and Google's Gemini AI.

## Key Features

- **User Authentication:** Registration and login functionality.
- **Role-Based Access:** Separate QA Engineer and Expert Reviewer roles.
- **Requirements Analysis:** AI-assisted analysis of software requirements.
- **Test Case Generation:** Generate test cases based on software requirements.
- **Software Documentation:** Generate structured software documents using AI.
- **Project Management:** Organize and manage QA projects.

*Note: AI-generated results should be reviewed and validated by qualified users.*

## Technologies Used

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Python, Flask |
| AI Integration | Google Gemini AI |
| API Communication | REST API, Axios |
| Authentication | JWT, bcrypt |
| Styling | CSS |

## System Architecture

CaseForge AI follows a frontend-backend architecture:

```text
          User
           |
           v
    React Frontend
      (Vite)
           |
           | HTTP / REST API
           v
     Flask Backend
           |
           v
     Google Gemini AI
           |
           v
     AI-Generated Results
           |
           v
    React Frontend
```

The frontend communicates with the Flask backend through HTTP requests. The backend handles application logic, authentication, and AI integration before returning responses to the frontend.

## Project Structure

```text
CaseForge-AI/
│
├── CaseForge Backend/
│   ├── api/
│   │   └── app.py
│   ├── modules/
│   ├── tests/
│   └── requirements.txt
│
├── CaseForge Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── Docs/
│   └── Project Documentation
│
├── README.md
└── .gitignore
```

## Installation and Setup

Follow these instructions to run CaseForge AI locally on Windows.

### Prerequisites

Make sure you have installed:

- Python
- Node.js and npm
- Git
- A Google Gemini API key for AI functionality

### 1. Clone the Repository

```bash
git clone https://github.com/BelalElshazly10/CaseForge-AI.git
```

Navigate into the project:

```bash
cd CaseForge-AI
```

### 2. Set Up the Backend

Open a terminal and navigate to the backend folder:

```powershell
cd "CaseForge Backend"
```

Install the Python dependencies:

```powershell
python -m pip install -r requirements.txt
```

Navigate to the API folder:

```powershell
cd api
```

Start the Flask server:

```powershell
python app.py
```

The backend should be available at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open a second terminal and navigate to the frontend folder:

```powershell
cd "CaseForge Frontend"
```

Install the dependencies:

```powershell
npm install
```

Create a local `.env` file containing:

```env
VITE_API_URL=http://localhost:5000
```

Start the React development server:

```powershell
npm run dev
```

The frontend should be available at:

`http://localhost:5173`

### 4. AI Configuration

Configure the Gemini API credentials required by the backend using the environment variable names expected by the backend configuration.

**Important:** Never expose API keys or other sensitive credentials in the frontend or commit them to GitHub.

## API Endpoints

The Flask backend provides the following application endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user |
| POST | `/analyze` | Analyze software requirements |
| POST | `/generate-document` | Generate software documentation |

## Security

The project incorporates security-related mechanisms, including:

- JWT-based authentication.
- Password hashing using bcrypt.
- Backend-side API integration.
- Environment-based configuration for sensitive credentials.

## Documentation

Additional project documentation and the setup guide are available in the repository's `Docs` folder.

## Graduation Project

Developed as a university graduation project at the **Arab Academy for Science, Technology and Maritime Transport (AASTMT)**.

**Project:** CaseForge AI  
**Developer:** Belal Elshazly

---

## Repository

GitHub: [CaseForge-AI](https://github.com/BelalElshazly10/CaseForge-AI)

---

*CaseForge AI — Making Software Quality Assurance Smarter with AI.*
