import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import DarkVeil from "../components/DarkVeil";
import { useAuction } from "../context/AuctionContext";

export default function Dashboard() {
  const { items, myItems, itemsLoading, myItemsLoading, error, fetchItems, fetchMyItems } = useAuction();
  const [activeSection, setActiveSection] = useState("live");
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchItems();
    if (userInfo) {
      fetchMyItems();
    }
  }, [fetchItems, fetchMyItems]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Filter out the current user's own items from Live Auctions (client-side)
  const liveItems = userInfo
    ? items.filter((item) => item.user?._id?.toString() !== userInfo._id?.toString())
    : items;

  // Time remaining helper
  const getTimeRemaining = (endTime) => {
    const total = new Date(endTime) - new Date();
    if (total <= 0) return "Ended";
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((total / (1000 * 60)) % 60);
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const sidebarItems = [
    { label: "Live Auctions", key: "live" },
    { label: "My Products", key: "myProducts" },
    { label: "My Bids", key: "bids" },
    { label: "Sell Item", path: "/sell" },
    { label: "Settings", key: "settings" },
  ];

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="bg-[#1f2937]/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 animate-pulse">
      <div className="w-full h-48 bg-gray-700/50"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
        <div className="h-10 bg-gray-700/50 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-x-hidden pb-10">
      {/* Fixed DarkVeil Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <DarkVeil
            hueShift={-110}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.7}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        <Navbar />

        <div className="flex pt-24 min-h-screen">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-64 bg-[#111827]/80 backdrop-blur-md p-6 border-r border-gray-800/50 fixed h-full z-20"
          >
            <h2 className="text-xl font-semibold mb-8 text-red-500">
              Dashboard
            </h2>

            <ul className="space-y-4 text-gray-300">
              {sidebarItems.map((item, index) =>
                item.path ? (
                  <Link to={item.path} key={index}>
                    <li className="hover:text-white hover:bg-white/10 p-2 rounded-md cursor-pointer transition mb-2 block">
                      {item.label}
                    </li>
                  </Link>
                ) : (
                  <li
                    key={index}
                    onClick={() => setActiveSection(item.key)}
                    className={`hover:text-white hover:bg-white/10 p-2 rounded-md cursor-pointer transition mb-2 ${
                      activeSection === item.key
                        ? "text-white bg-white/10 border-l-2 border-red-500"
                        : ""
                    }`}
                  >
                    {item.label}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-10 ml-64">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 mb-6 flex items-center justify-between">
                  <p><strong>Error:</strong> {error}</p>
                </div>
              )}

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  {
                    title: "Active Bids",
                    value: liveItems.length,
                    color: "text-red-500",
                  },
                  {
                    title: "Won Auctions",
                    value: "0",
                    color: "text-green-500",
                  },
                  {
                    title: "Listed Items",
                    value: myItems.length,
                    color: "text-yellow-500",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-[#1f2937]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-red-500/30 transition duration-300"
                  >
                    <h3 className="text-gray-400 mb-2">{stat.title}</h3>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* ===== LIVE AUCTIONS SECTION ===== */}
              {activeSection === "live" && (
                <>
                  <h2 className="text-2xl font-semibold mb-6">
                    🔥 Live Auctions
                  </h2>

                  {itemsLoading ? (
                    <div className="grid grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : liveItems.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">
                        No live auctions right now.
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Check back later or list your own item!
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {liveItems.map((item) => (
                        <motion.div
                          key={item._id}
                          variants={itemVariants}
                          className="bg-[#1f2937]/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-red-900/20 transition duration-300 border border-gray-700/50"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-contain bg-[#111827]/50 p-4"
                          />
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">
                                {item.title}
                              </h3>
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-gray-400 mb-1">
                              Current Bid:{" "}
                              <span className="text-white font-semibold">
                                ₹{item.currentPrice?.toLocaleString()}
                              </span>
                            </p>
                            <p className="text-xs text-yellow-400 mb-4">
                              ⏰ {getTimeRemaining(item.endTime)}
                            </p>
                            {item.user && (
                              <p className="text-xs text-gray-500 mb-3">
                                by {item.user.name}
                              </p>
                            )}
                            <Link
                              to={`/bid/${item._id}`}
                              className="block w-full"
                            >
                              <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition font-medium shadow-lg shadow-red-600/20">
                                Place Bid
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}

              {/* ===== MY PRODUCTS SECTION ===== */}
              {activeSection === "myProducts" && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">📦 My Products</h2>
                    <Link to="/sell">
                      <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        + List New Item
                      </button>
                    </Link>
                  </div>

                  {!userInfo ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">
                        Login to see your products
                      </p>
                      <button
                        onClick={() => navigate("/auth")}
                        className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                      >
                        Login
                      </button>
                    </div>
                  ) : myItemsLoading ? (
                    <div className="grid grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : myItems.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">
                        You haven't listed any items yet.
                      </p>
                      <Link to="/sell">
                        <button className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition">
                          Sell Your First Item
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myItems.map((item) => (
                        <motion.div
                          key={item._id}
                          variants={itemVariants}
                          className="bg-[#1f2937]/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-yellow-500/30 transition duration-300"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-contain bg-[#111827]/50 p-4"
                          />
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">
                                {item.title}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-gray-400 mb-1">
                              Current Bid:{" "}
                              <span className="text-white font-semibold">
                                ₹{item.currentPrice?.toLocaleString()}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              Starting: ₹{item.startingPrice?.toLocaleString()}
                            </p>
                            <p className="text-xs text-yellow-400 mb-3">
                              ⏰ {getTimeRemaining(item.endTime)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.bids?.length || 0} bid
                              {item.bids?.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}

              {/* ===== PLACEHOLDER SECTIONS ===== */}
              {activeSection === "bids" && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-4">📊 My Bids</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}

              {activeSection === "settings" && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-4">⚙ Settings</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
