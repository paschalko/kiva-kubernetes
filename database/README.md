# Database

This folder is reserved for database configuration and scripts. The app uses **MongoDB**.

Connection is configured in **backend**: see `backend/src/config/database.js`. Set `MONGODB_URI` in `backend/.env` (e.g. `mongodb://localhost:27017/kiva-blog` or your MongoDB Atlas connection string).

Models (User, Post) live in `backend/src/models/` and are used by the API.
