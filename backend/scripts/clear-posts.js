const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Post = require('../src/models/Post');

async function run() {
  const uri = (process.env.MONGODB_URI || 'mongodb://localhost:27017/kiva-blog').trim().replace(/^=+/, '');
  await mongoose.connect(uri);
  const deleted = (await Post.deleteMany({})).deletedCount;
  console.log('Deleted', deleted, 'post(s).');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
