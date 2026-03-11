const express = require('express');
const path = require('path');
const Post = require('../models/Post');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public: get all posts (no auth required) with optional search (username or title)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? {
          $or: [
            { authorUsername: new RegExp(q, 'i') },
            { title: new RegExp(q, 'i') },
          ],
        }
      : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    const userId = req.user?._id?.toString();
    const withLiked = posts.map((p) => ({
      ...p,
      liked: userId ? (p.likes || []).some((id) => id.toString() === userId) : false,
      likesCount: (p.likes || []).length,
    }));
    res.json(withLiked);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch posts' });
  }
});

// Public: get single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const userId = req.user?._id?.toString();
    res.json({
      ...post,
      liked: userId ? (post.likes || []).some((id) => id.toString() === userId) : false,
      likesCount: (post.likes || []).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch post' });
  }
});

// Auth required: create post (title + image or video + caption)
router.post('/', requireAuth, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Media file (image or video) required' });
    }
    const title = (req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const caption = (req.body.caption || '').trim();
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaUrl = `/uploads/${req.file.filename}`;
    const post = await Post.create({
      author: req.user._id,
      authorUsername: req.user.username,
      authorProfileImageUrl: req.user.profileImageUrl || '',
      title,
      caption,
      mediaType: isVideo ? 'video' : 'image',
      mediaUrl,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create post' });
  }
});

// Auth required: like/unlike
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const id = req.user._id;
    const idx = post.likes.findIndex((lid) => lid.toString() === id.toString());
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(id);
    }
    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx < 0 });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update like' });
  }
});

// Auth required: delete own post
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not allowed to delete this post' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete post' });
  }
});

module.exports = router;
