const mongoose = require('mongoose');

const auctionItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    currentPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    endTime: {
      type: Date,
      required: true,
    },
    bids: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

module.exports = AuctionItem;
