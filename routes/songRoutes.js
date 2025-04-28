import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Song from '../models/song.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the existing upload middleware

// To get __dirname in ES modules
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Route: Upload a new song (cover image + audio file)
router.post('/upload', protect, upload.fields([
    { name: 'coverImage', maxCount: 1 }, // Accept a single cover image
    { name: 'audio', maxCount: 1 }        // Accept a single audio file
]), async (req, res) => {
    const { title, artist, isPublic } = req.body;
    const coverImagePath = req.files.coverImage[0].path; // Path to uploaded cover image
    const audioPath = req.files.audio[0].path;           // Path to uploaded audio file

    try {
        // Create and save a new song using the static uploadSong method
        const newSong = await Song.uploadSong(
            title,
            artist,
            coverImagePath,
            audioPath,
            req.user._id,
            isPublic === 'true' // Convert 'true' string to boolean
        );
        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: Fetch all public songs (no authentication required)
router.get('/public', async (req, res) => {
    try {
        const songs = await Song.find({ isPublic: true }); // Find songs marked as public
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public songs' });
    }
});

// Route: Fetch all songs uploaded by the logged-in user
router.get('/my', protect, async (req, res) => {
    try {
        const songs = await Song.find({ uploadedBy: req.user._id }); // Find songs uploaded by current user
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your songs' });
    }
});

// Route: Like or unlike a song
router.put('/like/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Song.findById(id); // Find song by ID
        const user = req.user._id;

        // Toggle like: if already liked, remove like; if not, add like
        if (song.likes.includes(user)) {
            song.likes = song.likes.filter(like => like.toString() !== user.toString());
        } else {
            song.likes.push(user);
        }

        await song.save(); // Save updated song
        res.status(200).json({ message: 'Song like status updated', song });
    } catch (error) {
        res.status(500).json({ message: 'Error liking song: ' + error.message });
    }
});

export default router;
