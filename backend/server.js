const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { checkDbConnection } = require('./middleware/dbCheckMiddleware');

const userRoutes = require('./routes/userRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const socketHandlers = require('./socketHandlers');

dotenv.config();

connectDB();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket handlers
socketHandlers(io);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Ensure DB connection per request only on Vercel (serverless)
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    await connectDB();
    next();
  });
}

app.use(express.json({ limit: '50mb' }));

// Guard all API routes — returns 503 immediately if MongoDB is not connected
app.use('/api', checkDbConnection);

app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

// Prevent crashes from unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

if (require.main === module || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;

