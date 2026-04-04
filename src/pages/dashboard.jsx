import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import DarkVeil from "../components/DarkVeil";
import { useAuction } from "../context/AuctionContext";
import { socket } from "../socket";

export default function Dashboard() {
  const { items, myItems, itemsLoading, myItemsLoading, error, fetchItems, fetchMyItems } = useAuction();
  const [activeSection, setActiveSection] = useState("live");
  const [localItems, setLocalItems] = useState([]);
  const [localMyItems, setLocalMyItems] = useState([]);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchItems();
    if (userInfo) {
      fetchMyItems();
    }
  }, [fetchItems, fetchMyItems, userInfo?._id]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    setLocalMyItems(myItems);
  }, [myItems]);

  useEffect(() => {
    socket.on("globalBidUpdate", ({ auctionId, currentPrice }) => {
      setLocalItems((prev) =>
        prev.map((item) => (item._id === auctionId ? { ...item, currentPrice } : item))
      );
      setLocalMyItems((prev) =>
        prev.map((item) => (item._id === auctionId ? { ...item, currentPrice } : item))
      );
    });

    socket.on("globalAuctionEnded", ({ auctionId }) => {
      setLocalItems((prev) =>
        prev.map((item) => (item._id === auctionId ? { ...item, status: "ended" } : item))
      );
      setLocalMyItems((prev) =>
        prev.map((item) => (item._id === auctionId ? { ...item, status: "ended" } : item))
      );
    });

    return () => {
      socket.off("globalBidUpdate");
      socket.off("globalAuctionEnded");
    };
  }, []);

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

  const liveItems = userInfo
    ? localItems.filter((item) => item.status === 'active' && item.user?._id?.toString() !== userInfo._id?.toString())
    : localItems.filter((item) => item.status === 'active');

  const myBidsItems = userInfo
    ? localItems.filter((item) => 
        item.bids && item.bids.some((bid) => bid.user?.toString() === userInfo._id?.toString())
      )
    : [];

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
    { 
      label: "Live Auctions", 
      key: "live", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: "My Products", 
      key: "myProducts",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      label: "My Bids", 
      key: "bids",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      label: "Sell Item", 
      path: "/sell",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: "Settings", 
      path: "/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

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

            <ul className="space-y-2 text-gray-300">
              {sidebarItems.map((item, index) => {
                const isActive = activeSection === item.key;
                const baseStyles = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group`;
                const activeStyles = `text-white bg-red-600/10 border-l-4 border-red-500 shadow-[inset_4px_0_0_0_#ef4444]`;
                const inactiveStyles = `hover:text-white hover:bg-white/5`;

                return item.path ? (
                  <Link to={item.path} key={index} className="block">
                    <li className={`${baseStyles} ${inactiveStyles}`}>
                      <span className="text-gray-400 group-hover:text-red-400 transition-colors">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </li>
                  </Link>
                ) : (
                  <li
                    key={index}
                    onClick={() => setActiveSection(item.key)}
                    className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                  >
                    <span className={`${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  </li>
                );
              })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                    value: localMyItems.length,
                    color: "text-yellow-500",
                  },
                  {
                    title: "Account",
                    value: "Settings",
                    color: "text-blue-400",
                    isLink: true,
                    path: "/settings"
                  },
                ].map((stat, index) => (
                  stat.isLink ? (
                    <Link key={index} to={stat.path}>
                      <motion.div
                        variants={itemVariants}
                        className="bg-[#1f2937]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-red-500/30 transition duration-300 h-full cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-gray-400">{stat.title}</h3>
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </motion.div>
                    </Link>
                  ) : (
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
                  )
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
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {item.title}
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
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
                      {localMyItems.map((item) => (
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

              {/* ===== MY BIDS SECTION ===== */}
              {activeSection === "bids" && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">📊 My Active Bids</h2>
                  </div>

                  {!userInfo ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">
                        Login to track your bids
                      </p>
                      <button
                        onClick={() => navigate("/auth")}
                        className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                      >
                        Login
                      </button>
                    </div>
                  ) : myBidsItems.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">
                        You haven't placed any bids on active auctions yet.
                      </p>
                      <button
                        onClick={() => setActiveSection("live")}
                        className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                      >
                        Browse Live Auctions
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myBidsItems.map((item) => {
                        const myMaxBid = Math.max(
                           ...item.bids.filter(b => b.user?.toString() === userInfo._id?.toString()).map(b => b.amount)
                        );
                        return (
                          <motion.div
                            key={item._id}
                            variants={itemVariants}
                            className="bg-[#1f2937]/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-blue-500/30 transition duration-300"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 object-contain bg-[#111827]/50 p-4"
                            />
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold truncate w-3/4">
                                  {item.title}
                                </h3>
                                
                                {item.highestBidder?.toString() === userInfo._id?.toString() ? (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full whitespace-nowrap">
                                    Winning!
                                  </span>
                                ) : (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full whitespace-nowrap">
                                    Outbid
                                  </span>
                                )}

                              </div>
                              
                              <p className="text-gray-400 mb-1 flex justify-between">
                                <span>Current Price:</span>
                                <span className="text-white font-semibold">
                                  ₹{item.currentPrice?.toLocaleString()}
                                </span>
                              </p>
                              
                              <p className="text-gray-400 mb-3 flex justify-between">
                                <span>Your Top Bid:</span>
                                <span className="text-blue-400 font-semibold">
                                  ₹{myMaxBid.toLocaleString()}
                                </span>
                              </p>

                              <p className="text-xs text-yellow-400 mb-4 text-center bg-yellow-500/10 py-1.5 rounded">
                                ⏰ {getTimeRemaining(item.endTime)}
                              </p>
                              
                              <Link
                                to={`/bid/${item._id}`}
                                className="block w-full"
                              >
                                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition font-medium shadow-lg shadow-blue-600/20">
                                  {item.highestBidder?.toString() === userInfo._id?.toString() ? "View Auction" : "Bid Again"}
                                </button>
                              </Link>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
