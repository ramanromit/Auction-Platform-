const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Fix for Node.js v22+ OpenSSL 3.x SSL handshake errors with Atlas
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — avoids IPv6 DNS issues on some networks

      // Connection pool — default is 5, too low for socket + HTTP concurrency
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
