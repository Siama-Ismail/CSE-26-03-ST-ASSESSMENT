const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Video = require('../models/Video');

// Landing page 
router.get('/', (req, res) => {
  res.render('index', { title: 'Videx - Video Streaming Platform' });
});

//Videos page (after joining)
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().latest();
    res.render('videos', { title: 'My Videos', videos });
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Failed to load videos' 
    });
  }
});

//  Upload video page
router.get('/upload', (req, res) => {
  res.render('upload', { title: 'Upload Video' });
});

// API: Upload video 
router.post('/api/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, quality, category, tags } = req.body;

    // Validation
    if (!title || !description || !quality || !category || !tags || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both video and thumbnail are required' 
      });
    }

    // Create video document
    const video = new Video({
      title: title.trim(),
      description: description.trim(),
      quality,
      category: category.trim(),
      tags: tags.trim(),
      videoPath: `/uploads/${req.files.video[0].filename}`,
      thumbnailPath: `/uploads/${req.files.thumbnail[0].filename}`
    });

    await video.save();

    res.json({ 
      success: true, 
      message: 'Video uploaded successfully!',
      video 
    });
  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up uploaded files if there's an error
    if (req.files?.video?.[0]) {
      const fs = require('fs');
      fs.unlink(req.files.video[0].path, () => {});
    }
    if (req.files?.thumbnail?.[0]) {
      const fs = require('fs');
      fs.unlink(req.files.thumbnail[0].path, () => {});
    }

    res.status(500).json({ 
      success: false, 
      message: err.message || 'Upload failed' 
    });
  }
});

// ── API: Get single video 
router.get('/api/video/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }
    res.json({ success: true, video });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching video' 
    });
  }
});

// ── API: Delete video 
router.delete('/api/video/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    // Delete files
    const fs = require('fs');
    const path = require('path');
    
    const videoPath = path.join(__dirname, '../public', video.videoPath);
    const thumbnailPath = path.join(__dirname, '../public', video.thumbnailPath);
    
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

    res.json({ 
      success: true, 
      message: 'Video deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting video' 
    });
  }
});

module.exports = router;
