import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import DarkVeil from "../components/DarkVeil";
import { useAuction } from "../context/AuctionContext";


export default function Dashboard() {
  const { items } = useAuction();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-x-hidden pb-10">

      {/* Fixed DarkVeil Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <DarkVeil
            hueShift={-110} // Maroon theme
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
          {/* Sidebar */}
          {/* Sidebar Area */}
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
              {[
                { label: '🏠 Overview', path: '/dashboard' },
                { label: '🔥 Live Auctions', path: '/dashboard' },
                { label: '📦 My Bids', path: '/dashboard' },
                { label: '💰 Sell Item', path: '/sell' },
                { label: '⚙ Settings', path: '/dashboard' }
              ].map((item, index) => (
                <Link to={item.path} key={index}>
                  <li className="hover:text-white hover:bg-white/10 p-2 rounded-md cursor-pointer transition mb-2 block">
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
          </motion.div>

          {/* Main Content - Offset by sidebar width */}
          <div className="flex-1 p-10 ml-64">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { title: "Active Bids", value: "12", color: "text-red-500" },
                  { title: "Won Auctions", value: "3", color: "text-green-500" },
                  { title: "Listed Items", value: "5", color: "text-yellow-500" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-[#1f2937]/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-red-500/30 transition duration-300"
                  >
                    <h3 className="text-gray-400 mb-2">{stat.title}</h3>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Featured Auctions */}
              <h2 className="text-2xl font-semibold mb-6">
                Live Auctions
              </h2>

              <motion.div
                className="grid grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-[#1f2937]/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-red-900/20 transition duration-300 border border-gray-700/50"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-48 object-contain bg-[#111827]/50 p-4"
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Current Bid: {item.bid}
                      </p>
                      <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition font-medium shadow-lg shadow-red-600/20">
                        Place Bid
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
