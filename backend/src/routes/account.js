const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Get current account info + user's posts
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        profileImageUrl: user.profileImageUrl || '',
        createdAt: user.createdAt,
      },
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load account' });
  }
});

// Update profile image URL
router.patch('/', requireAuth, async (req, res) => {
  try {
    const { profileImageUrl } = req.body;
    req.user.profileImageUrl = (profileImageUrl || '').trim();
    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        profileImageUrl: req.user.profileImageUrl || '',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update account' });
  }
});

module.exports = router;

