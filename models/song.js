import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    coverImage: { type: String, required: true },
    audioUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isPublic: { type: Boolean, default: false }, // ADDED: Visibility control
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

songSchema.statics.uploadSong = async function (title, artist, coverImagePath, audioPath, userId, isPublic = true) {
    try {
        // Upload cover image to Cloudinary
        const coverImage = await cloudinary.v2.uploader.upload(coverImagePath, {
            folder: 'songs/covers',
        });

        // Upload the audio file to Cloudinary
        const audio = await cloudinary.v2.uploader.upload(audioPath, {
            resource_type: 'video', // Cloudinary treats audio as video
            folder: 'songs/audio',
        });

        // Create new song record with URLs and visibility status
        const newSong = new this({
            title,
            artist,
            coverImage: coverImage.secure_url,
            audioUrl: audio.secure_url,
            uploadedBy: userId,
            isPublic, // ADDED: Store visibility
        });

        // Save the song to MongoDB
        await newSong.save();
        return newSong;
    } catch (error) {
        throw new Error('Error uploading song: ' + error.message);
    }
};

const Song = mongoose.model('Song', songSchema);
export default Song;
