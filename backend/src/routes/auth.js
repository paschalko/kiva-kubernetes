const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, profileImageUrl } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ username: username.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    const user = await User.create({
      username: username.trim(),
      password,
      profileImageUrl: (profileImageUrl || '').trim(),
    });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        profileImageUrl: user.profileImageUrl || '',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const user = await User.findOne({ username: username.trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        profileImageUrl: user.profileImageUrl || '',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

module.exports = router;
