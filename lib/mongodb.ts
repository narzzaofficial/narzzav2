// lib/mongodb.ts

import mongoose from "mongoose";

// ─── Environment Variables ────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "⚠️ MONGODB_URI is not defined in environment variables - Database features will be unavailable"
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ─── Global Cache Declaration ─────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// ─── Initialize Cache ─────────────────────────────────────────────────────────

const cached: MongooseCache = global.mongoose || { 
  conn: null, 
  promise: null 
};

// Store in global to persist across hot reloads in development
if (!global.mongoose) {
  global.mongoose = cached;
}

// ─── Connection Function ──────────────────────────────────────────────────────

/**
 * Connect to MongoDB with caching
 * 
 * Returns cached connection if available, otherwise creates new connection.
 * Returns null if MONGODB_URI is not defined.
 * 
 * @returns Mongoose instance or null
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  // Early return if no URI configured
  if (!MONGODB_URI) {
    return null;
  }

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if not already pending
  if (!cached.promise) {
    const connectionOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 30_000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, connectionOptions)
      .then((mongooseInstance) => {
        if (process.env.NODE_ENV === "development") {
          console.log("Mongo connected");
        }
        return mongooseInstance;
      })
      .catch((error) => {
        // Reset promise so next request can retry
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", error);
        throw error;
      });
  }

  // Wait for connection to complete
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Promise already rejected and reset above
    return null;
  }
}

// ─── Disconnect Function (Optional - untuk testing) ──────────────────────────

/**
 * Disconnect from MongoDB and clear cache
 * Useful for testing or graceful shutdown
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("🔌 MongoDB disconnected");
  }
}

// ─── Connection Status Check ──────────────────────────────────────────────────

/**
 * Check if MongoDB is currently connected
 */
export function isConnected(): boolean {
  return cached.conn !== null && mongoose.connection.readyState === 1;
}

// ─── Default Export ───────────────────────────────────────────────────────────

export default connectDB;
