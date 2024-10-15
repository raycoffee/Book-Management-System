import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connection successful!');
  } catch (error) {
    console.error('DB connection failed:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
