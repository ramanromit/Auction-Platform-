import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import { useAuction } from "../context/AuctionContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { myItems, fetchMyItems, deleteItem } = useAuction();
  const [userInfo, setUserInfo] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      const parsed = JSON.parse(data);
      setUserInfo(parsed);
      setName(parsed.name || "");
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    if (userInfo?.token) {
      fetchMyItems();
    }
  }, [fetchMyItems, userInfo?.token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `http://${window.location.hostname}:5000/api/users/profile`,
        { name },
        config
      );

      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this listed item? If it had any current top bidder, their wallet will be refunded automatically.")) {
      try {
        await deleteItem(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto pt-28 px-6 pb-20">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8"
        >
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 mt-2">Update your profile and manage your active auction listings.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <form onSubmit={handleUpdateProfile} className="bg-[#1f2937]/80 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                 <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 Edit Profile
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Manage Listings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-[#1f2937]/80 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-xl h-full">
               <h2 className="text-xl font-semibold mb-6 flex items-center">
                 <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
                 My Listed Items
              </h2>

              {myItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
                  <p className="text-gray-400 mb-4">You don't have any active listings.</p>
                  <button onClick={() => navigate("/sell")} className="text-red-400 hover:text-red-300 font-medium">
                    + Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-500 transition group">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-200">{item.title}</h3>
                          <div className="flex items-center text-sm text-gray-400 mt-1 space-x-4">
                            <span>Started: ₹{item.startingPrice.toLocaleString()}</span>
                            <span>Current: <span className="text-red-400 font-medium">₹{(item.currentPrice || item.startingPrice).toLocaleString()}</span></span>
                            <span className={`px-2 py-0.5 rounded text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Remove Listing"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
