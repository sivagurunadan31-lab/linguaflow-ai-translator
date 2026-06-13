import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<user>') || uri.includes('<password>') || uri.includes('<cluster>')) {
    console.warn('MongoDB is not configured. Running API in safe demo memory mode.');
    return false;
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return true;
};
