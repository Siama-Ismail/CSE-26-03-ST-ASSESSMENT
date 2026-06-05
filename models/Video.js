const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters']
  },
  quality: {
    type: String,
    enum: ['360p', '720p', '1080p'],
    required: [true, 'Quality is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: {
    type: String,
    required: [true, 'Tags are required'],
    trim: true
  },
  videoPath: {
    type: String,
    required: [true, 'Video path is required']
  },
  thumbnailPath: {
    type: String,
    required: [true, 'Thumbnail path is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Sort by latest first by default
videoSchema.query.latest = function() {
  return this.sort({ uploadedAt: -1 });
};

module.exports = mongoose.model('Video', videoSchema);
