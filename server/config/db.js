/**
 * db.js — MongoDB connection configuration
 * Uses Mongoose with infinite retry and capped exponential backoff.
 * The server stays alive even when the database is temporarily unreachable
 * (e.g. while Atlas IP whitelist is being updated).
 *
 * Future experiments may extend this with replica sets or Atlas configuration.
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Retries indefinitely with exponential backoff capped at 30 seconds.
 * Does NOT exit the process on failure — the server stays up.
 */
const connectDB = async () => {
  let attempt = 0;

  const tryConnect = async () => {
    attempt++;
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Log connection lifecycle events
      mongoose.connection.off('disconnected', onDisconnect); // avoid duplicate listeners
      mongoose.connection.on('disconnected', onDisconnect);
      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected.');
        attempt = 0; // reset backoff counter on success
      });

    } catch (error) {
      // Calculate capped backoff: 2, 4, 8, 16, 30, 30, 30 ... seconds
      const backoffSec = Math.min(Math.pow(2, attempt), 30);
      console.error(`❌ MongoDB connection attempt ${attempt} failed: ${error.message}`);
      console.log(`⏳ Retrying in ${backoffSec}s... (server remains running)`);
      setTimeout(tryConnect, backoffSec * 1000);
    }
  };

  const onDisconnect = () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    attempt = 0;
    setTimeout(tryConnect, 2000);
  };

  await tryConnect();
};

module.exports = connectDB;
