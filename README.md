# Kiva Blog

A simple blog where users can sign up, log in, and post images or videos with captions. Anyone can browse the feed; you need an account to create posts, like, or delete your own posts.

## Project structure

- **backend/** — Node.js (Express) API: auth, posts, file uploads
- **frontend/** — React (Vite) app: feed, login, signup, new post
- **database/** — MongoDB connection config (see below)

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

### 1. Database (MongoDB)

- Install MongoDB locally or create a free cluster on MongoDB Atlas.
- You will set the connection URL in the backend `.env` (see step 3).

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/kiva-blog
JWT_SECRET=your-secret-key-change-in-production
```

For Atlas, set `MONGODB_URI` to your Atlas connection string.

Start the API:

```bash
npm run dev
```

Server runs at http://localhost:5000.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173 and is proxied to the backend for `/api` and `/uploads`.

## Usage

- **Guests:** Open the site and browse all posts. You cannot like or create posts.
- **Signed in:** Log in or sign up, then you can create posts (image or video + caption), like posts, and delete your own posts.

## API overview

- `POST /api/auth/signup` — register (username, password)
- `POST /api/auth/login` — login (username, password)
- `GET /api/posts` — list posts (optional auth for like state)
- `GET /api/posts/:id` — single post
- `POST /api/posts` — create post (auth, multipart: `media` + `caption`)
- `POST /api/posts/:id/like` — toggle like (auth)
- `DELETE /api/posts/:id` — delete own post (auth)
