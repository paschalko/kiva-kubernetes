/**
 * Deletes all users and all posts from the database.
 * Run from the backend folder: node scripts/clear-data.js
 * Uses backend/.env so it clears the same DB as your app.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');

async function run() {
  const uri = (process.env.MONGODB_URI || 'mongodb://localhost:27017/kiva-blog').trim().replace(/^=+/, '');
  // Log which DB we're using (hide password)
  const safeUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log('Using database:', safeUri);
  await mongoose.connect(uri);
  const usersDeleted = (await User.deleteMany({})).deletedCount;
  const postsDeleted = (await Post.deleteMany({})).deletedCount;
  console.log(`Deleted ${usersDeleted} users and ${postsDeleted} posts.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
