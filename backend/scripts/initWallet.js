const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const User = require('../models/User');

const initWallets = async () => {
  await connectDB();
  try {
    console.log('Initializing wallet balances...');
    const result = await User.updateMany(
      { walletBalance: { $exists: false } },
      { $set: { walletBalance: 20000 } }
    );
    
    const resultAll = await User.updateMany(
      {}, 
      { $set: { walletBalance: 20000 } }
    );

    console.log(`Wallets initialized. Modified ${resultAll.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

initWallets();
