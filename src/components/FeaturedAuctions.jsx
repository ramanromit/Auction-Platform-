import { useEffect, useState } from "react";
import DecryptedText from "./DecryptedText";
import { useNavigate } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

export default function FeaturedAuctions() {
  const navigate = useNavigate();
  const { items, fetchItems, itemsLoading } = useAuction();
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const activeItems = items
      .filter((item) => item.status === "active" && new Date(item.endTime) > new Date())
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
      .slice(0, 3);
    setFeaturedItems(activeItems);
  }, [items]);

  const handlePlaceBid = (id) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.token) {
      navigate(`/bid/${id}`);
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-20 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl">
        <h2 className="text-4xl font-bold mb-20 text-white text-center">
          <DecryptedText
            text="Featured Auctions"
            speed={50}
            maxIterations={8}
            animateOn="view"
            sequential
          />
        </h2>

        {itemsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : featuredItems.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No featured auctions available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 place-items-center">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="bg-[#1F2937] rounded-2xl p-8 w-80 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-red-600/30 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="h-56 flex items-center justify-center mb-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full object-contain"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white truncate">
                  {item.title}
                </h3>

                <p className="text-gray-400 mb-6">
                  Current Bid:{" "}
                  <span className="text-red-500 font-semibold">
                    ₹{item.currentPrice?.toLocaleString()}
                  </span>
                </p>

                <button
                  onClick={() => handlePlaceBid(item._id)}
                  className="bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg font-semibold transition text-white"
                >
                  Place Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
