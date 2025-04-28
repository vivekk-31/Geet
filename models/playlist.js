// models/playlist.js
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
