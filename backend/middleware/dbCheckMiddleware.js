const mongoose = require('mongoose');


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
