const mongoose = require('mongoose');

/**
 * Middleware that checks if MongoDB is connected before processing the request.
 * Returns a fast 503 error instead of waiting for a 10s timeout.
 */
const checkDbConnection = (req, res, next) => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    return res.status(503).json({
      message: 'Database is not connected. Please check your MongoDB Atlas IP Whitelist.',
      dbStatus: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    });
  }
  next();
};

module.exports = { checkDbConnection };
