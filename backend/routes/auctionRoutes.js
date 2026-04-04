const express = require('express');
const router = express.Router();
const {
  createAuctionItem,
  getAuctionItems,
  getMyAuctionItems,
  getAuctionItemById,
  deleteAuctionItem,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');

// Public — returns all active auction items
router.get('/', getAuctionItems);

// Protected routes
router.post('/', protect, createAuctionItem);
router.get('/mine', protect, getMyAuctionItems);
router.delete('/:id', protect, deleteAuctionItem);

// Public
router.get('/:id', getAuctionItemById);

module.exports = router;
