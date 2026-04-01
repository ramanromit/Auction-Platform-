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
      setItem((prev) => prev ? { ...prev, status: "ended", currentPrice: data.finalPrice } : prev);
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
                {isEnded && winnerName && (
                  <p className="text-green-500 mt-2 font-medium">Winner: {winnerName} (₹{currentBid.toLocaleString()})</p>
                )}
              </div>

              {/* BID FORM */}
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
                  disabled={isEnded || timeLeft <= 0}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition disabled:bg-gray-600"
                >
                  {(isEnded || timeLeft <= 0) ? "Auction Ended" : "Place Bid"}
                </button>
              </form>

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