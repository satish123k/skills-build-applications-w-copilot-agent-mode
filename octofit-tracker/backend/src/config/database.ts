import mongoose from 'mongoose';

export const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

export const connectDatabase = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn(
      'MongoDB is not available; continuing without a persistent database connection.',
      error instanceof Error ? error.message : error,
    );
  }
};

connectDatabase();

db.on('error', (error) => {
  console.warn('MongoDB connection error:', error);
});

export default db;
