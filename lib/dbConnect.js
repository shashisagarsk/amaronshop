// lib/dbConnect.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If a connection is already cached, return it
  if (cached.conn) {
    console.log('✅ Using existing database connection.');
    return cached.conn;
  }

  // If a promise is not in progress, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('⏳ Creating a new database connection...');
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New database connection established.');
      return mongoose;
    });
  }

  // Await the promise to resolve and get the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise and throw the error
    console.error('❌ Database connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;