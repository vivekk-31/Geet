// Importing required modules
import express from "express";  // Importing express framework
import cors from "cors";         // Importing CORS for cross-origin requests
import dotenv from "dotenv";     // Importing dotenv for environment variable management
import connectDB from "./config/db.js"; // Importing database connection function
import userRoutes from "./routes/userRoutes.js"; // Importing user-related routes
import songRoutes from './routes/songRoutes.js'; // Importing song-related routes
import PlaylistRoute from './routes/PlaylistRoute.js'; // Importing playlist-related routes

// Configuring to use environmental variables from a .env file
dotenv.config();

// Creating an Express application
export const app = express();

// Connecting to the MongoDB database
connectDB();

// Using CORS policy to allow cross-origin requests (so frontend and backend can communicate)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default to localhost if no env variable found
    credentials: true,  
  })
);

// Telling the app to parse incoming JSON requests automatically
app.use(express.json());

// Setting up different routes for users, songs, and playlists
app.use('/api/users', userRoutes);       // User-related routes will be prefixed with /api/users
app.use('/api/songs', songRoutes);        // Song-related routes will be prefixed with /api/songs
app.use('/api/playlists', PlaylistRoute); // Playlist-related routes will be prefixed with /api/playlists

// Defining the port number to run the server, using the environment variable or 3000 as default
const port = process.env.PORT || 3000;

// Creating a basic route to test if the server is working
app.get('/', (req, res) => {
    res.send('Hello World'); // Sending "Hello World" as a response
});

// Starting the server and making it listen on the specified port
app.listen(port, () => {
  console.log(`My Music app listening on port ${port}`);
});
