import mongoose from 'mongoose';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
