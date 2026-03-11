/**
 * MongoDB connection. Set MONGODB_URI in .env (see .env.example).
 * Use mongodb://localhost:27017/kiva-blog for local, or your Atlas connection string.
 * If Atlas gives "querySrv ECONNREFUSED", use the Standard connection string (not SRV) from Atlas.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kiva-blog';
    uri = uri.trim().replace(/^=+/, ''); // fix accidental MONGODB_URI== in .env
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('querySrv')) {
      console.error('Tip: If using Atlas, try the "Standard" connection string (not SRV) in Atlas Connect -> Drivers.');
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
