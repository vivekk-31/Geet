import Song from '../models/song.js';

export const uploadSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    const coverImage = req.files.coverImage[0].path;
    const audioFile = req.files.audioFile[0].path;
    const userId = req.user._id;

    const song = await Song.uploadSong(title, artist, coverImage, audioFile, userId);
    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Error uploading song' });
  }
};
