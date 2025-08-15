# Shipsy Todo - MERN Stack CRUD Application

A full-stack todo application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring authentication, CRUD operations, and advanced data management capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Complete CRUD Operations**: Create, Read, Update, Delete todos
- **Data Fields**:
  - **Text Field**: Todo title and description
  - **Enum Field**: Priority selection (Low, Medium, High)
  - **Boolean Field**: Completion status
  - **Date Field**: Due date for tasks
  - **Calculated Field**: `isOverdue` (automatically calculated based on due date and completion status)

### Advanced Features
- **Pagination**: Efficient data loading with configurable page sizes
- **Filtering**: Filter todos by completion status (All, Completed, Not Completed)
- **Searching**: Case-insensitive search across title and description fields
- **Sorting**: Dynamic sorting by multiple fields (Created Date, Title, Priority, Due Date, Status)
- **Real-time Updates**: Immediate UI updates after CRUD operations
- **Responsive Design**: Mobile-friendly interface with adaptive layouts


## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging

### Frontend
- **React.js**: UI library with hooks
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with CSS variables and responsive design

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Mongoose**: Object Data Modeling (ODM) library

## 📋 Project Structure

```
shipsy-assignment/
├── server/                 # Backend application
│   ├── src/
│   │   ├── models/         # Database schemas
│   │   │   ├── User.js     # User model with password hashing
│   │   │   └── Todo.js     # Todo model with virtual fields
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.js     # Authentication routes
│   │   │   └── todos.js    # Todo CRUD routes
│   │   ├── middleware/     # Custom middleware
│   │   │   └── auth.js     # JWT authentication middleware
│   │   └── index.js        # Server entry point
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── client/                 # Frontend application
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── api.js         # API client functions
│   │   ├── main.jsx       # React entry point
│   │   └── styles.css     # Global styles
│   ├── package.json       # Frontend dependencies
│   └── index.html         # HTML template
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account


### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Todo Endpoints

All todo endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Todos (with pagination, filtering, searching, sorting)
```http
GET /api/todos?page=1&limit=10&completed=true&search=meeting&sortBy=dueDate&sortOrder=asc
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `completed` (boolean): Filter by completion status
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (createdAt, title, priority, dueDate, completed)
- `sortOrder` (string): Sort direction (asc, desc)

**Response:**
```json
{
  "items": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "priority": "high",
      "completed": false,
      "dueDate": "2024-01-15T10:00:00.000Z",
      "isOverdue": true,
      "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "search": "meeting",
  "sortBy": "dueDate",
  "sortOrder": "asc"
}
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "completed": false,
  "dueDate": "2024-01-20T10:00:00.000Z"
}
```

#### Update Todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated Task",
  "priority": "high",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
```

## 🗄️ Database Schema

### User Model
```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
}
```

### Todo Model
```javascript
{
  title: { type: String, required: true },
  description: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}
```


