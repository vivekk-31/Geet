import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Playlist from '../models/playlist.js';
import Song from '../models/song.js';

const router = express.Router();

// Create a new playlist
router.post('/', protect, async (req, res) => {
    const { name, songs = [] } = req.body; // Include songs from the request body

    try {
        const newPlaylist = new Playlist({
            name,
            createdBy: req.user._id,
            songs, // Save the song IDs if provided
        });
        await newPlaylist.save();
        res.status(201).json(newPlaylist); // Return the created playlist with songs
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist' });
    }
});


// Add song to playlist
// Update a playlist’s name and/or songs
router.put('/:playlistId', protect, async (req, res) => {
    const { name, songs } = req.body;
    try {
      const playlist = await Playlist.findById(req.params.playlistId);
      if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  
      if (name !== undefined)    playlist.name  = name;
      if (Array.isArray(songs))  playlist.songs = songs;
  
      await playlist.save();
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Error updating playlist' });
    }
  });

  // Delete a playlist
  router.delete('/:playlistId', protect, async (req, res) => {
    try {
      const deleted = await Playlist.findByIdAndDelete(req.params.playlistId);
      if (!deleted) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      res.json({ message: 'Playlist deleted', id: req.params.playlistId });
    } catch (error) {
      console.error("DELETE playlist error:", error);
      res.status(500).json({ message: 'Error deleting playlist' });
    }
  });
  


// Get all playlists for a user
router.get('/', protect, async (req, res) => {
    try {
        const playlists = await Playlist.find({ createdBy: req.user._id }).populate('songs');
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists' });
    }
});

  
export default router;
