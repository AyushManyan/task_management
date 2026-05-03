# Task Management Application

A modern, full-stack task management system built with React and Express.js. This application enables teams to create, manage, and track projects and tasks efficiently with real-time collaboration features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Features
- **User Authentication**
  - Secure user registration and login
  - JWT-based token authentication
  - Password encryption with bcryptjs

- **Project Management**
  - Create, read, update, and delete projects
  - Assign team members to projects
  - Track project status and progress
  - Project-based task organization

- **Task Management**
  - Create and manage tasks within projects
  - Update task status (in progress, completed, pending)
  - Assign tasks to team members
  - Task descriptions and detailed information
  - Progress tracking and visualization

- **User & Team Management**
  - User registration and profile management
  - Team member assignment to projects
  - Role-based access control
  - Admin panel for system management

- **Security**
  - Protected API routes with JWT authentication
  - Input validation and sanitization
  - CORS configuration for secure cross-origin requests
  - Helmet.js for HTTP security headers

- **User Interface**
  - Responsive design with Tailwind CSS
  - Intuitive component-based architecture
  - Real-time UI updates
  - Protected routes and error boundaries

## Tech Stack

### Frontend
- **Framework**: React 19.2.5
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS 3.4.19
- **HTTP Client**: Axios 1.15.2
- **Routing**: React Router DOM 7.14.2
- **Icons**: Lucide React 1.14.0
- **Authentication**: JWT Decode 4.0.0
- **Code Quality**: ESLint 10.2.1

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 8.23.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Security**: bcryptjs 3.0.3
- **Request Logging**: Morgan 1.10.1
- **Security**: Helmet.js 8.1.0
- **CORS**: CORS 2.8.6
- **Validation**: Express-validator 7.3.2
- **Environment Config**: dotenv 17.4.2
- **Development**: Nodemon 3.1.14

## Project Structure

```
task_management/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── AdminPanel.jsx      # Admin Dashboard
│   │   │   ├── ProjectList.jsx     # Project Listing
│   │   │   ├── TaskList.jsx        # Task Management
│   │   │   ├── TaskCreate.jsx      # Create Tasks
│   │   │   ├── TaskEditForm.jsx    # Edit Tasks
│   │   │   ├── ProjectEditForm.jsx # Edit Projects
│   │   │   ├── UserList.jsx        # User Management
│   │   │   ├── ProgressBar.jsx     # Progress Visualization
│   │   │   ├── SearchBar.jsx       # Search Functionality
│   │   │   ├── ErrorBoundary.jsx   # Error Handling
│   │   │   ├── ProtectedRoute.jsx  # Route Protection
│   │   │   └── ...
│   │   ├── context/                # React Context
│   │   │   ├── AuthContext.jsx     # Authentication State
│   │   │   └── RefreshContext.jsx  # Refresh Trigger Context
│   │   ├── pages/                  # Page Components
│   │   │   ├── Login.jsx           # Login Page
│   │   │   ├── Signup.jsx          # Registration Page
│   │   │   └── Dashboard.jsx       # Main Dashboard
│   │   ├── services/
│   │   │   └── api.js              # API Service Layer
│   │   ├── utils/
│   │   │   └── progress.js         # Progress Calculation Utilities
│   │   ├── App.jsx                 # Root Component
│   │   ├── main.jsx                # Application Entry Point
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js              # Vite Configuration
│   ├── tailwind.config.js           # Tailwind CSS Configuration
│   ├── postcss.config.js            # PostCSS Configuration
│   └── eslint.config.js             # ESLint Configuration
│
├── server/                          # Express.js Backend Application
│   ├── src/
│   │   ├── controllers/            # Business Logic
│   │   │   ├── authController.js   # Authentication Logic
│   │   │   ├── projectController.js # Project Operations
│   │   │   ├── taskController.js   # Task Operations
│   │   │   └── dashboardController.js # Dashboard Stats
│   │   ├── models/                 # Database Models
│   │   │   ├── User.js             # User Model
│   │   │   ├── Project.js          # Project Model
│   │   │   └── Task.js             # Task Model
│   │   ├── routes/                 # API Routes
│   │   │   ├── authRoutes.js       # Auth Endpoints
│   │   │   └── projectTaskRoutes.js # Project & Task Endpoints
│   │   ├── middleware/             # Express Middleware
│   │   │   ├── authMiddleware.js   # JWT Verification
│   │   │   └── errorMiddleware.js  # Error Handling
│   │   ├── validators/             # Input Validation
│   │   │   ├── authValidator.js    # Auth Validation Rules
│   │   │   ├── projectValidator.js # Project Validation Rules
│   │   │   └── taskValidator.js    # Task Validation Rules
│   │   ├── config/
│   │   │   └── db.js               # Database Configuration
│   │   ├── app.js                  # Express App Setup
│   │   └── server.js               # Server Entry Point
│   └── package.json
│
└── README.md                        # Project Documentation
```

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **MongoDB** (v4.0 or higher)
  - Local installation, or
  - MongoDB Atlas (Cloud) connection string

### Verify Installation

```bash
node --version
npm --version
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task_management
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Copy contents from .env.example or create new with required variables

# Verify installation
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from root or server)
cd client

# Install dependencies
npm install

# Create .env file for frontend (if needed)
# Configure API base URL if different from default

# Start development server
npm run dev
```

## Environment Variables

### Server Environment Variables (.env)

Create a `.env` file in the `server` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task_management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/task_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `client` directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### Important Security Notes

- **Never** commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Rotate JWT secrets periodically
- Use MongoDB Atlas for production databases
- Enable SSL/TLS in production

## Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Terminal 2 - Start Frontend Dev Server

```bash
cd client
npm run dev
```

The frontend will be available on `http://localhost:5173`

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
# Creates optimized production build in dist/ directory
```

#### Start Backend (Production)

```bash
cd server
npm start
```


## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

### Project Endpoints

All project endpoints require JWT authentication via `Authorization: Bearer <token>` header

#### Get All Projects
```
GET /projects
Authorization: Bearer <token>
```

#### Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description",
  "status": "active"
}
```

#### Get Project by ID
```
GET /projects/:id
Authorization: Bearer <token>
```

#### Update Project
```
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "completed"
}
```

#### Delete Project
```
DELETE /projects/:id
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks
```
GET /projects/:projectId/tasks
Authorization: Bearer <token>
```

#### Create Task
```
POST /projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "assignedTo": "userId"
}
```

#### Update Task
```
PUT /projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress"
}
```

#### Delete Task
```
DELETE /projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
```

### Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Project Architecture

### Frontend Architecture

#### Component Hierarchy
```
App
├── ProtectedRoute
│   ├── Dashboard
│   │   ├── ProjectList
│   │   │   └── ProjectEditForm
│   │   ├── TaskPanel
│   │   │   ├── TaskList
│   │   │   ├── TaskCreate
│   │   │   └── TaskEditForm
│   │   ├── UserList
│   │   ├── AdminPanel
│   │   └── SearchBar
├── PublicRoute
│   ├── Login
│   └── Signup
```

#### State Management
- **AuthContext**: Manages user authentication state, tokens, and user info
- **RefreshContext**: Triggers data refresh across components
- **Local State**: Component-level state for forms and UI

#### API Service Layer
- Centralized API calls in `services/api.js`
- Axios interceptors for token management
- Error handling and response normalization

### Backend Architecture

#### Request Flow
```
Client Request
    ↓
Express Middleware (CORS, Helmet, Morgan)
    ↓
Routes (/api/...)
    ↓
Auth Middleware (JWT Verification)
    ↓
Request Validators
    ↓
Controllers (Business Logic)
    ↓
Models (Database Operations via Mongoose)
    ↓
Database (MongoDB)
```

#### Database Models

##### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

##### Project Schema
```javascript
{
  name: String,
  description: String,
  status: String (enum: active, completed, archived),
  owner: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

##### Task Schema
```javascript
{
  title: String,
  description: String,
  status: String (enum: pending, in-progress, completed),
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```