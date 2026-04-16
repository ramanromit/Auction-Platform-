import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuction } from "../context/AuctionContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { socket } from "../socket";

export default function BidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchItemById } = useAuction();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));


  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      const data = await fetchItemById(id);
      if (data) {
        setItem(data);
        if (data.status === 'ended') {
           setIsEnded(true);
           setTimeLeft(0);
        } else {
           const remaining = Math.floor((new Date(data.endTime) - new Date()) / 1000);
           setTimeLeft(remaining > 0 ? remaining : 0);
           if (remaining <= 0) setIsEnded(true);
        }
      }
      setLoading(false);
    };
    loadItem();
  }, [id, fetchItemById]);

  // Socket.IO sync
  useEffect(() => {
    if (!item || !userInfo?.token || isEnded) return;

    socket.emit("joinAuction", { auctionId: id });

    socket.on("auctionState", (data) => {
      setItem((prev) => prev ? { ...prev, currentPrice: data.currentPrice, bids: data.bids, status: data.status } : prev);
      if (data.status === "ended") setIsEnded(true);
    });

    socket.on("bidUpdate", (data) => {
      setItem((prev) => prev ? { ...prev, currentPrice: data.currentPrice, bids: data.bids } : prev);
      if (data.highestBidder === userInfo._id) {
        setSuccessMessage("🎉 You are the highest bidder!");
      } else {
        setSuccessMessage("");
      }
    });

    socket.on("bidError", (msg) => {
      setError(msg);
    });

    socket.on("auctionEnded", (data) => {
      setIsEnded(true);
      setTimeLeft(0);
      setWinnerName(data.winner || "Unknown");
      setItem((prev) => prev ? {
        ...prev,
        status: "ended",
        currentPrice: data.finalPrice,
        auctionResult: data.auctionResult || prev.auctionResult,
      } : prev);
    });

    return () => {
      socket.emit("leaveAuction", { auctionId: id });
      socket.off("auctionState");
      socket.off("bidUpdate");
      socket.off("bidError");
      socket.off("auctionEnded");
    };
  }, [id, item ? item._id : null, userInfo?.token, isEnded, userInfo?._id]);

  useEffect(() => {
    if (timeLeft <= 0 || isEnded) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isEnded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Navbar />
        <div className="flex justify-center items-center pt-28 px-6">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading auction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Navbar />
        <div className="flex justify-center items-center pt-28 px-6">
          <div className="text-center">
            <p className="text-xl text-gray-400 mb-4">Auction item not found</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentBid = item.currentPrice || item.startingPrice;
  const minimumBid = currentBid + 1000;

  const handleBid = (e) => {
    e.preventDefault();

    if (isEnded || timeLeft <= 0) {
      setError("Auction has ended.");
      return;
    }
    
    if (!userInfo || !userInfo.token) {
      setError("Please login to place a bid.");
      return;
    }

    if (Number(bidAmount) < minimumBid) {
      setError(`Minimum bid must be ₹${minimumBid.toLocaleString()}`);
      setSuccessMessage("");
      return;
    }

    if (userInfo.walletBalance !== undefined && Number(bidAmount) > userInfo.walletBalance) {
      setError(`Insufficient wallet balance. You only have ₹${userInfo.walletBalance.toLocaleString()}`);
      setSuccessMessage("");
      return;
    }

    if (item.user && item.user._id === userInfo._id) {
      setError("You cannot bid on your own item.");
      return;
    }

    // Emit bid to server
    socket.emit("placeBid", {
      auctionId: item._id,
      amount: Number(bidAmount),
      token: userInfo.token,
    });
    
    setError("");
    setBidAmount("");
  };

  const formatTime = () => {
    if (isEnded || timeLeft <= 0) return "Ended";
    const days = Math.floor(timeLeft / (60 * 60 * 24));
    const hours = Math.floor((timeLeft / (60 * 60)) % 24);
    const min = Math.floor((timeLeft / 60) % 60);
    const sec = timeLeft % 60;
    if (days > 0) return `${days}d ${hours}h ${min}m`;
    return `${hours > 0 ? hours + "h " : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="flex justify-center items-center pt-28 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1f2937]/80 backdrop-blur-md p-8 rounded-xl w-full max-w-3xl shadow-xl border border-gray-700"
        >
          <div className="grid grid-cols-2 gap-8">
            {/* LEFT SIDE - IMAGE */}
            <div>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-contain"
              />
              <div className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {item.condition}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-400 text-sm">{item.description}</p>
                )}
                {item.user && (
                  <p className="text-gray-500 text-xs">Seller: {item.user.name}</p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - DETAILS */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{item.title}</h2>

              <p className="text-red-500 text-2xl font-semibold mb-2">
                ₹{currentBid.toLocaleString()}
              </p>

              <p className="text-gray-400 mb-4">
                Minimum next bid: ₹{minimumBid.toLocaleString()}
              </p>


              {/* TIMER */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">Auction Ends In</p>
                <p className={`text-xl font-semibold ${(isEnded || timeLeft <= 0) ? 'text-red-400' : 'text-yellow-400'}`}>
                  {formatTime()}
                </p>
              </div>

              {/* AUCTION RESULT PANEL (shown when auction ended) */}
              {(isEnded || item.status === 'ended') && item.auctionResult && item.auctionResult.finalPrice > 0 ? (
                <div className="space-y-4">
                  {/* Winner Card */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-green-400 font-semibold text-lg">Auction Concluded</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Winner</p>
                        <p className="text-white font-semibold">
                          {item.auctionResult.winnerName || winnerName || 'No winner'}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Final Price</p>
                        <p className="text-green-400 font-semibold">
                          ₹{item.auctionResult.finalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Sold At</p>
                        <p className="text-white font-medium text-xs">
                          {item.auctionResult.soldAt
                            ? new Date(item.auctionResult.soldAt).toLocaleString()
                            : '—'}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Total Bids</p>
                        <p className="text-white font-semibold">
                          {item.auctionResult.totalBids || item.bids?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/5 rounded-lg p-3 border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1.5">Payment</p>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.auctionResult.paymentStatus === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : item.auctionResult.paymentStatus === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : item.auctionResult.paymentStatus === 'refunded'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.auctionResult.paymentStatus === 'completed' ? 'bg-green-400'
                          : item.auctionResult.paymentStatus === 'failed' ? 'bg-red-400'
                          : item.auctionResult.paymentStatus === 'refunded' ? 'bg-purple-400'
                          : 'bg-yellow-400'
                        }`}></span>
                        {item.auctionResult.paymentStatus?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-3 border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1.5">Delivery</p>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.auctionResult.deliveryStatus === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : item.auctionResult.deliveryStatus === 'shipped' || item.auctionResult.deliveryStatus === 'in_transit'
                          ? 'bg-blue-500/20 text-blue-400'
                          : item.auctionResult.deliveryStatus === 'returned'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.auctionResult.deliveryStatus === 'delivered' ? 'bg-green-400'
                          : item.auctionResult.deliveryStatus === 'shipped' || item.auctionResult.deliveryStatus === 'in_transit' ? 'bg-blue-400'
                          : item.auctionResult.deliveryStatus === 'returned' ? 'bg-red-400'
                          : 'bg-gray-400'
                        }`}></span>
                        {item.auctionResult.deliveryStatus?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (isEnded || item.status === 'ended') ? (
                /* Ended but no bids / no result data */
                <div className="bg-white/5 border border-gray-700/50 rounded-xl p-5 text-center">
                  <p className="text-gray-400">This auction ended with no bids.</p>
                </div>
              ) : (
                /* BID FORM — active auction */
                <form onSubmit={handleBid} className="space-y-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your bid"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />

                  {/* Quick Increment Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBidAmount(String(minimumBid))}
                      className="px-4 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600 transition"
                    >
                      +₹1,000
                    </button>

                    <button
                      type="button"
                      onClick={() => setBidAmount(String(currentBid + 5000))}
                      className="px-4 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600 transition"
                    >
                      +₹5,000
                    </button>

                    <button
                      type="button"
                      onClick={() => setBidAmount(String(currentBid + 10000))}
                      className="px-4 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600 transition"
                    >
                      +₹10,000
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  {successMessage && (
                    <p className="text-green-500 text-sm">
                      {successMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                  >
                    Place Bid
                  </button>
                </form>
              )}

              {/* BID HISTORY */}
              {item.bids && item.bids.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Bid History</h3>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {item.bids
                      .slice()
                      .reverse()
                      .map((bid, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm bg-white/5 p-2 rounded"
                        >
                          <span>
                            {bid.bidderName ? <span className="text-gray-400 mr-2">{bid.bidderName}</span> : null}
                            ₹{bid.amount?.toLocaleString()}
                          </span>
                          <span className="text-gray-400">
                            {bid.time
                              ? typeof bid.time === "string"
                                ? bid.time
                                : new Date(bid.time).toLocaleTimeString()
                              : ""}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(-1)}
                className="mt-6 text-gray-400 hover:text-white text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}