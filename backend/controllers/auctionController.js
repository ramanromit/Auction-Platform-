const AuctionItem = require('../models/AuctionItem');
const User = require('../models/User');

// @desc    Create new auction item
// @route   POST /api/auctions
// @access  Private
const createAuctionItem = async (req, res, next) => {
  try {
    const { title, description, category, condition, startingPrice, image, endTime } = req.body;

    if (!title || !description || !category || !startingPrice || !image || !endTime) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const auctionItem = await AuctionItem.create({
      user: req.user._id,
      title,
      description,
      category,
      condition: condition || 'Good',
      startingPrice: Number(startingPrice),
      currentPrice: Number(startingPrice),
      image,
      endTime: new Date(endTime),
      status: 'active',
    });

    if (auctionItem) {
      res.status(201).json(auctionItem);
    } else {
      res.status(400);
      throw new Error('Invalid auction item data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active auction items (+ recently ended within 24h)
// @route   GET /api/auctions
// @access  Public
const getAuctionItems = async (req, res, next) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const items = await AuctionItem.find({
      $or: [
        { status: 'active' },
        { status: 'ended', endTime: { $gte: oneDayAgo } },
      ],
    })
      .select('-bids')  // Don't send full bid history in list view
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();           // Plain JS objects — 3-5x faster than Mongoose docs

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's auction items
// @route   GET /api/auctions/mine
// @access  Private
const getMyAuctionItems = async (req, res, next) => {
  try {
    const items = await AuctionItem.find({ user: req.user._id })
      .select('-bids')
      .sort({ createdAt: -1 })
      .lean();

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single auction item by ID
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionItemById = async (req, res, next) => {
  try {
    const item = await AuctionItem.findById(req.params.id)
      .populate('user', 'name email')
      .lean();

    if (item) {
      res.json(item);
    } else {
      res.status(404);
      throw new Error('Auction item not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an auction item
// @route   DELETE /api/auctions/:id
// @access  Private
const deleteAuctionItem = async (req, res, next) => {
  try {
    const item = await AuctionItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Auction item not found');
    }

    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this item');
    }

    // Refund highest bidder if auction is active
    if (item.status === 'active' && item.highestBidder) {
      const prevBidder = await User.findById(item.highestBidder);
      if (prevBidder) {
        prevBidder.walletBalance += item.currentPrice;
        await prevBidder.save();
      }
    }

    await item.deleteOne();

    res.json({ message: 'Auction item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuctionItem,
  getAuctionItems,
  getMyAuctionItems,
  getAuctionItemById,
  deleteAuctionItem,
};
