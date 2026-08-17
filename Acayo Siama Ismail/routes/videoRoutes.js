const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

// Landing page 
router.get('/', (req, res) => {
  res.render('index', { title: 'Videx - Video Streaming Platform', active: 'home' });
});

//Videos page (after joining)
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().latest();
    res.render('videos', { title: 'My Videos', videos, active: 'videos' });
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
  res.render('upload', { title: 'Upload Video', active: 'upload' });
});

// API: Cloudinary config (cloud name + unsigned upload preset) for client uploads
router.get('/api/config', (req, res) => {
  res.json({
    cloudName: process.env.CLOUD_NAME || '',
    uploadPreset: process.env.CLOUD_PRESET || ''
  });
});

// API: Upload video (metadata; files are uploaded to Cloudinary by the client)
router.post('/api/upload', async (req, res) => {
  try {
    const { title, description, quality, category, tags, videoPath, thumbnailPath, videoId, deleteToken } = req.body;

    // Validation
    if (!title || !description || !quality || !category || !tags || !videoPath || !thumbnailPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields and uploaded files are required' 
      });
    }

    // Create video document
    const video = new Video({
      title: title.trim(),
      description: description.trim(),
      quality,
      category: category.trim(),
      tags: tags.trim(),
      videoPath: videoPath,
      thumbnailPath: thumbnailPath,
      videoId: videoId || null,
      deleteToken: deleteToken || null
    });

    await video.save();

    res.json({ 
      success: true, 
      message: 'Video uploaded successfully!',
      video 
    });
  } catch (err) {
    console.error('Upload error:', err);
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

// ── API: Download single video 
router.get('/api/video/:id/download', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    const videoUrl = video.videoPath || '';
    // Cloudinary URL -> force-download by injecting the fl_attachment flag
    if (videoUrl.includes('res.cloudinary.com')) {
      const marker = '/video/upload/';
      const idx = videoUrl.indexOf(marker);
      if (idx !== -1) {
        const dlUrl = videoUrl.slice(0, idx) + marker + 'fl_attachment/' + videoUrl.slice(idx + marker.length);
        return res.redirect(dlUrl);
      }
      // Fallback: cannot build an attachment URL, just stream the original
      return res.redirect(videoUrl);
    }
    // Legacy local file fallback
    const filePath = path.join(__dirname, '../uploads', path.basename(videoUrl));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video file not found on server' 
      });
    }

    const ext = path.extname(videoUrl) || '.mp4';
    const base = video.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase() || 'video';
    res.download(filePath, base + ext);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading video' 
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

    // Best-effort: delete the media from Cloudinary using the unsigned delete token
    if (video.deleteToken && process.env.CLOUD_NAME) {
      try {
        const body = new URLSearchParams();
        body.append('token', video.deleteToken);
        await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/delete_by_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
      } catch (cloudErr) {
        console.error('Cloudinary delete failed:', cloudErr.message);
      }
    }

    // Delete local files (legacy uploads)
    const videoPath = path.join(__dirname, '../uploads', path.basename(video.videoPath || ''));
    const thumbnailPath = path.join(__dirname, '../uploads', path.basename(video.thumbnailPath || ''));
    
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
