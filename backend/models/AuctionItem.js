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
    condition: {
      type: String,
      required: true,
      default: 'Good',
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
    status: {
      type: String,
      enum: ['active', 'ended', 'sold'],
      default: 'active',
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    bids: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number, required: true },
        time: { type: Date, default: Date.now },
        bidderName: { type: String },
      },
    ],
    auctionResult: {
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      winnerName: {
        type: String,
        default: null,
      },
      finalPrice: {
        type: Number,
        default: 0,
      },
      soldAt: {
        type: Date,
        default: null,
      },
      totalBids: {
        type: Number,
        default: 0,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      deliveryStatus: {
        type: String,
        enum: ['not_shipped', 'shipped', 'in_transit', 'delivered', 'returned'],
        default: 'not_shipped',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries — matches the exact query patterns in controllers
auctionItemSchema.index({ status: 1, endTime: -1 });       // getAuctionItems: filter by status + sort by endTime
auctionItemSchema.index({ user: 1, createdAt: -1 });       // getMyAuctionItems: filter by user + sort by createdAt
auctionItemSchema.index({ status: 1, createdAt: -1 });     // general listing sorted by newest
auctionItemSchema.index({ endTime: 1 });                   // timer-based lookups

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

module.exports = AuctionItem;
