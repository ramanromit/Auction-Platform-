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
      { walletBalance: { $exists: false } }, // Target only users without the field
      { $set: { walletBalance: 20000 } }
    );
    // Also update anyone who has it but it's null or some other check if needed, 
    // but schema default doesn't apply to existing documents unless loaded and saved.
    // So let's just forcefully set everyone who doesn't have it explicitly or is missing it.
    
    // Actually, setting everyone is safer since it's a new feature and we want everyone to have 20000 minimum
    const resultAll = await User.updateMany(
      {}, // Target all users to be safe given current requirements
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
