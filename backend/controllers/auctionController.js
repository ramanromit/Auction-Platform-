const AuctionItem = require('../models/AuctionItem');

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

// @desc    Get all active auction items
// @route   GET /api/auctions
// @access  Public
const getAuctionItems = async (req, res, next) => {
  try {
    const items = await AuctionItem.find({ status: 'active' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

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
      .sort({ createdAt: -1 });

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
      .populate('user', 'name email');

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

module.exports = {
  createAuctionItem,
  getAuctionItems,
  getMyAuctionItems,
  getAuctionItemById,
};
