# Games Review Board

A full-stack web application that allows users to browse, add, and review games. Built with Node.js and Express for the backend and Next.js for the frontend.

## Project Overview

This application is built with:
- **Backend**: Node.js, Express, and PostgreSQL with Prisma ORM
- **Frontend**: Next.js with React and Tailwind CSS

### Features

- User authentication with JWT
- Game management (browsing, adding)
- Review system (adding reviews, viewing game reviews)
- Pagination, filtering, and sorting capabilities
- Responsive UI with Tailwind CSS

## Database Schema

The application uses a PostgreSQL database with the following models:

- **User**: Manages user accounts and authentication
- **Game**: Stores game information with relations to users (creator) and reviews
- **Review**: Contains game reviews with relations to both users and games

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

## Installation

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd game-review-board
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/game-review-board?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

4. Generate Prisma client
```bash
npx prisma generate
```

5. Apply database migrations
```bash
npx prisma migrate dev
```

6. Seed the database with sample data
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd games-review-frontend
```

2. Install frontend dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Running the Application

### Start the Backend Server

```bash
cd games-review-backend
cd src
node app.js
```

The API server will run on `http://localhost:3000` by default.

### Start the Frontend Server

```bash
cd games-review-frontend
npm run build ; npm run start
```

The frontend will be available at `http://localhost:3001` (specified in package.json)

## API Endpoints

### User Routes

- **POST /api/users/register** - Register a new user
  ```json
  {
    "username": "newuser",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST /api/users/login** - Login a user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET /api/users/me** - Get current user profile (requires authentication)

### Game Routes

- **GET /api/games** - Get all games with pagination, filtering, and sorting
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `search`: Search by title
    - `genre`: Filter by genre
    - `author`: Filter by author
    - `sortBy`: Sort by 'date', 'title', or 'rating'
    - `sortOrder`: 'asc' or 'desc'

- **GET /api/games/:id** - Get a single game by ID
  - Query Parameters:
    - `reviewToShow`: Number of reviews to include (default: 5)

- **POST /api/games** - Add a new game (requires authentication)
  ```json
  {
    "title": "Game Title",
    "description": "Game description",
    "author": "Game Developer",
    "genre": ["RPG", "Adventure"]
  }
  ```

### Review Routes

- **POST /api/reviews** - Add a review to a game (requires authentication)
  ```json
  {
    "gameId": 1,
    "rating": 5,
    "comment": "Great game!"
  }
  ```

- **GET /api/reviews/game/:gameId** - Get reviews for a game with pagination
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `sortBy`: Sort by 'date' or 'rating'
    - `sortOrder`: 'asc' or 'desc'

## Authentication

For protected routes, include the JWT token in the request header:
```
Authorization: Bearer <your-token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Resource created
- 400: Bad request (validation error)
- 401: Unauthorized
- 404: Resource not found
- 500: Server error

## Project Structure

### Backend Structure

```
game-review-board/
├── generated/            # Generated Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Database seeder
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Middleware functions
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── app.js            # Express application
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

### Frontend Structure

```
games-review-frontend/
├── src/                  # Source directory
│   ├── app/              # Next.js 13+ app directory
│   │   ├── dashboard/    # Dashboard page
│   │   ├── games/        # Games pages
│   │   │   ├── [id]/     # Game details page
│   │   │   └── add/      # Add game page
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── layout.js/    # Shared layout with auth wrapper
│   │   └── page.js       # Home page
│   └── utils/            # Utility functions
│       ├── api.js        # API client
│       └── auth.js       # Authentication context
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## Frontend Features

### Pages
- **Home Page**: Introduction to the application
- **Games Page**: List of games with pagination and basic information
- **Game Details Page**: Detailed information about a game with reviews
- **Add Game Page**: Form to add a new game 
- **Login/Register Pages**: Authentication forms
- **Dashboard**: User profile and games added by the user

### Components
- Responsive navigation bar
- Star rating component
- Review form
- Pagination controls
- Authentication context provider