const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  authorProfileImageUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  caption: {
    type: String,
    default: '',
    maxlength: 2000,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
