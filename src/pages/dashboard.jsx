import Navbar from "../components/navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <Navbar />

      <div className="flex pt-24">

        {/* Sidebar */}
        <div className="w-64 bg-[#111827] min-h-screen p-6 border-r border-gray-800">
          <h2 className="text-xl font-semibold mb-8 text-red-500">
            Dashboard
          </h2>

          <ul className="space-y-4 text-gray-300">
            <li className="hover:text-white cursor-pointer transition">
              🏠 Overview
            </li>
            <li className="hover:text-white cursor-pointer transition">
              🔥 Live Auctions
            </li>
            <li className="hover:text-white cursor-pointer transition">
              📦 My Bids
            </li>
            <li className="hover:text-white cursor-pointer transition">
              💰 Sell Item
            </li>
            <li className="hover:text-white cursor-pointer transition">
              ⚙ Settings
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 mb-10">

            <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-gray-400 mb-2">Active Bids</h3>
              <p className="text-3xl font-bold text-red-500">12</p>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-gray-400 mb-2">Won Auctions</h3>
              <p className="text-3xl font-bold text-green-500">3</p>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-gray-400 mb-2">Listed Items</h3>
              <p className="text-3xl font-bold text-yellow-500">5</p>
            </div>

          </div>

          {/* Featured Auctions */}
          <h2 className="text-2xl font-semibold mb-6">
            Live Auctions
          </h2>

          <div className="grid grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 border border-gray-700">
              <img
                src="/src/assets/images/image1.png"
                alt="Auction Item"
                className="w-full h-48 object-contain bg-[#111827] p-4"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">
                  Luxury Watch
                </h3>
                <p className="text-gray-400 mb-4">
                  Current Bid: ₹45,000
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition">
                  Place Bid
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 border border-gray-700">
              <img
                src="/src/assets/images/image2.png"
                alt="Auction Item"
                className="w-full h-48 object-contain bg-[#111827] p-4"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">
                  Premium Sneakers
                </h3>
                <p className="text-gray-400 mb-4">
                  Current Bid: ₹12,500
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition">
                  Place Bid
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 border border-gray-700">
              <img
                src="/src/assets/images/image3.png"
                alt="Auction Item"
                className="w-full h-48 object-contain bg-[#111827] p-4"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">
                  Electric Guitar
                </h3>
                <p className="text-gray-400 mb-4">
                  Current Bid: ₹30,000
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition">
                  Place Bid
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
