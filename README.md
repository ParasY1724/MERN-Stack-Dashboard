
# CodeForum - MERN Stack Dashboard

<img src="https://cdn-icons-png.flaticon.com/512/10840/10840187.png" alt="CodeForum Logo" width="100">

CodeForum is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. It provides a platform for users to share posts, interact with a community, and track achievements.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and profile management
- Community forum for creating and viewing posts
- Comment system on posts
- User following system
- Achievement tracking with badges
- Responsive design for various screen sizes
- Search functionality for users and posts
- Social media sharing integration

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ParasY1724/MERN-Stack-Dashboard.git
   cd MERN-Stack-Dashboard
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

5. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite)

## Environment Variables

### Frontend (.env file in frontend directory)

```
VITE_BACKEND_URL='{YOUR BACKEND URL}'
```

### Backend (.env file in backend directory)

```
MONOGODB_URL="{YOUR DATABASE URL}"
CLOUDINARY_CLOUD_NAME='{YOUR CLOUDINARY_CLOUD_NAME}'
CLOUDINARY_API_KEY='{YOUR API_KEY}'
CLOUDINARY_API_SECRET='{YOUR API_SECRET}'
SECRET='{YOUR SECRET FOR JWT}'
```


## Technologies Used

- **Frontend:**
  - React
  - React Router for navigation
  - Context API for state management
  - Tailwind CSS for styling
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB for database
  - Mongoose as ODM
  - JSON Web Tokens (JWT) for authentication
- **Image/Video Upload:**
  - Cloudinary
- **Development Tools:**
  - Vite for frontend build tool
  - nodemon for backend development

## Project Structure

```
codeforum/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── package.json
└── README.md
```

## API Endpoints

- `/auth/signup` - User registration
- `/auth/login` - User login
- `/auth/users/:username` - Get user profile
- `/feed/posts` - Get all posts
- `/feed/post/:postId` - Get specific post
- `/feed/post` - Create new post
- `/feed/like-post/:postId` - Like/unlike a post
- `/feed/comment/:postId` - Comment on a post


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


Created with ❤️ by [Paras Yerunkar](https://github.com/parasY1724)
