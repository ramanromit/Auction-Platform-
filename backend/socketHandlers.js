const jwt = require('jsonwebtoken');
const AuctionItem = require('./models/AuctionItem');
const User = require('./models/User');

const activeTimers = new Map(); // Store active timers to prevent duplicates

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join an auction room
    socket.on('joinAuction', async ({ auctionId }) => {
      try {
        socket.join(auctionId);
        console.log(`Socket ${socket.id} joined auction ${auctionId}`);
        
        const auction = await AuctionItem.findById(auctionId).populate('user', 'name');
        if (auction) {
          // Send current state
          socket.emit('auctionState', {
            bids: auction.bids,
            currentPrice: auction.currentPrice,
            status: auction.status,
            highestBidder: auction.highestBidder
          });
          
          if (auction.status === 'active' && !activeTimers.has(auctionId)) {
            const timeRemaining = new Date(auction.endTime) - new Date();
            if (timeRemaining > 0) {
              const timer = setTimeout(async () => {
                await endAuction(auctionId, io);
              }, timeRemaining);
              activeTimers.set(auctionId, timer);
            } else {
              // Time expired
              await endAuction(auctionId, io);
            }
          }
        }
      } catch (err) {
        console.error('Error joining auction:', err);
      }
    });

    // Place bid logic
    socket.on('placeBid', async ({ auctionId, amount, token }) => {
      try {
        if (!token) return socket.emit('bidError', 'Not authorized to bid');
        
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
          return socket.emit('bidError', 'Invalid token');
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return socket.emit('bidError', 'Invalid user');

        const auction = await AuctionItem.findById(auctionId);
        if (!auction) return socket.emit('bidError', 'Auction not found');
        if (auction.status !== 'active') return socket.emit('bidError', 'Auction has ended');

        if (new Date() > new Date(auction.endTime)) {
          await endAuction(auctionId, io);
          return socket.emit('bidError', 'Auction time has expired');
        }

        const currentBid = auction.currentPrice || auction.startingPrice;
        if (amount < currentBid + 1000) {
          return socket.emit('bidError', `Minimum bid must be ₹${(currentBid + 1000).toLocaleString()}`);
        }

        if (auction.user.toString() === user._id.toString()) {
           return socket.emit('bidError', 'You cannot bid on your own item');
        }

        auction.currentPrice = amount;
        auction.highestBidder = user._id;
        auction.bids.push({
          user: user._id,
          amount: Number(amount),
          time: new Date(),
          bidderName: user.name
        });

        await auction.save();

        // Broadcast to specific auction room
        io.to(auctionId).emit('bidUpdate', {
          currentPrice: auction.currentPrice,
          bids: auction.bids,
          highestBidder: user._id,
          bidderName: user.name
        });

        // Broadcast global update for dashboard
        io.emit('globalBidUpdate', {
          auctionId: auction._id,
          currentPrice: auction.currentPrice
        });

      } catch (err) {
        console.error('Error placing bid:', err);
        socket.emit('bidError', 'Server error while placing bid');
      }
    });

    socket.on('leaveAuction', ({ auctionId }) => {
      socket.leave(auctionId);
      console.log(`Socket ${socket.id} left auction ${auctionId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

async function endAuction(auctionId, io) {
  try {
    const auction = await AuctionItem.findById(auctionId).populate('highestBidder', 'name');
    if (auction && auction.status === 'active') {
      auction.status = 'ended';
      await auction.save();
      
      io.to(auctionId).emit('auctionEnded', {
        winner: auction.highestBidder ? auction.highestBidder.name : null,
        finalPrice: auction.currentPrice
      });
      
      io.emit('globalAuctionEnded', { auctionId });

      if (activeTimers.has(auctionId)) {
        clearTimeout(activeTimers.get(auctionId));
        activeTimers.delete(auctionId);
      }
    }
  } catch (err) {
    console.error('Error ending auction:', err);
  }
}

module.exports = socketHandlers;
