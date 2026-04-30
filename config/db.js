const mongoose = require('mongoose');

const maskUri = (uri) => {
  try {
    return uri.replace(/:(.*?)@/, ':****@');
  } catch (e) {
    return 'MONGO_URI=******';
  }
};

const parseHostAndDb = (uri) => {
  try {
    const afterAt = uri.includes('@') ? uri.split('@')[1] : uri;
    const host = afterAt.split('/')[0] || 'unknown';
    const path = afterAt.split('/').slice(1).join('/') || '';
    const db = path.split('?')[0] || '';
    return { host, db };
  } catch (e) {
    return { host: 'unknown', db: '' };
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment');
    return;
  }

  const masked = maskUri(uri);
  const { host, db } = parseHostAndDb(uri);
  console.log(`Connecting to MongoDB host=${host} db=${db} uri=${masked}`);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (err.name) console.error('Error name:', err.name);
    process.exit(1);
  }
};

module.exports = connectDB;
