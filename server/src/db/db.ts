import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    }).then(m => {
      console.log('✅ MongoDB connected');
      return m;
    }).catch(err => {
      cachedPromise = null;
      console.error('❌ MongoDB connection failed:', err);
      throw err;
    });
  }

  await cachedPromise;
}

export default mongoose;
