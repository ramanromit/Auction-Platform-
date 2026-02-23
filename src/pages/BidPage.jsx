import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuction } from "../context/AuctionContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, placeBid } = useAuction();

  const item = items.find((i) => i.id === Number(id));

  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min timer

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!item) {
    return <div className="text-white p-10">Item not found</div>;
  }

  const minimumBid = item.bid + 1000;

  const handleBid = (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setError("Auction has ended.");
      return;
    }

    if (Number(bidAmount) < minimumBid) {
      setError(`Minimum bid must be ₹${minimumBid.toLocaleString()}`);
      setSuccess(false);
      return;
    }

    placeBid(item.id, Number(bidAmount));
    setError("");
    setSuccess(true);
    setBidAmount("");
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
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
                src={item.img}
                alt={item.title}
                className="w-full h-80 object-contain"
              />
            </div>

            {/* RIGHT SIDE - DETAILS */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{item.title}</h2>

              <p className="text-red-500 text-2xl font-semibold mb-2">
                ₹{item.bid.toLocaleString()}
              </p>

              <p className="text-gray-400 mb-4">
                Minimum next bid: ₹{minimumBid.toLocaleString()}
              </p>

              {/* TIMER */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">Auction Ends In</p>
                <p className="text-xl font-semibold text-yellow-400">
                  {formatTime()}
                </p>
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
                    className="px-4 py-2 bg-gray-700 rounded-md text-sm"
                  >
                    +1000
                  </button>

                  <button
                    type="button"
                    onClick={() => setBidAmount(String(item.bid + 5000))}
                    className="px-4 py-2 bg-gray-700 rounded-md text-sm"
                  >
                    +5000
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                {success && (
                  <p className="text-green-500 text-sm">
                    🎉 You are the highest bidder!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={timeLeft <= 0}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition disabled:bg-gray-600"
                >
                  Place Bid
                </button>
              </form>

              {/* BID HISTORY */}
              {item.bids.length > 0 && (
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
                          <span>₹{bid.amount.toLocaleString()}</span>
                          <span className="text-gray-400">
                            {bid.time}
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