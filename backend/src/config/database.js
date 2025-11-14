import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 * Connection string should be in .env as MONGODB_URI
 * Example: mongodb://127.0.0.1:27017/your-database-name
 * Or: mongodb://user:password@127.0.0.1:27017/your-database-name
 */
export const connectDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/basicdb';

    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    console.log(`Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
