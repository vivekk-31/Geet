

# Geet - Backend

Welcome to **Geet's Backend** — powering a seamless music sharing experience.  
Built with **Express.js** and **MongoDB**, deployed on **Render**.

## Features
- **User Authentication**: Secure Registration and Login with JWT tokens.
- **Password Hashing** with bcrypt for user security.
- **Upload Songs and Cover Images** using multer and disk storage.
- **Create and Manage Playlists**: Users can create playlists and add their uploaded songs.
- **Authorization Middleware**: Protects private API routes.
- **Public Songs Listing**: Browse songs shared publicly by others.
- **User-Specific Song Listing**: View all songs uploaded by the logged-in user.
- **Playlist Management**: View and manage personal playlists.
- **Efficient File Filtering**: Only audio and image files are allowed.
- **Error Handling Middleware**: Structured server error responses.
- **MongoDB Integration**: Mongoose models for users, songs, and playlists.
- **Environment Configurable**: Easy setup for production and development environments.
- **Production Ready** and deployed on Render.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (File Uploads)
- Bcrypt.js
- JSON Web Tokens (JWT)
- Render (Deployment)

## Environment Variables
Create a `.env` file at the root:

```bash
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
