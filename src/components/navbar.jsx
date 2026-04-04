import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuction } from "../context/AuctionContext";
import { socket } from "../socket";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetState } = useAuction();
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserInfo(JSON.parse(data));
    } else {
      setUserInfo(null);
    }
  }, [location.pathname]);

  // Wallet real-time update logic
  useEffect(() => {
    if (!userInfo?._id) return;

    const handleWalletUpdate = (data) => {
      if (data.userId === userInfo._id) {
        setUserInfo((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, walletBalance: data.balance };
          localStorage.setItem("userInfo", JSON.stringify(updated));
          return updated;
        });
      }
    };

    socket.on('walletUpdate', handleWalletUpdate);
    return () => socket.off('walletUpdate', handleWalletUpdate);
  }, [userInfo?._id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    resetState(); // Clear all cached auction data from context
    setUserInfo(null);
    setShowDropdown(false);
    navigate("/");
  };

  const isLanding = location.pathname === "/";
  const isAuth = location.pathname === "/auth" || location.pathname === "/signup" || location.pathname === "/signin" || location.pathname === "/register";
  const isAppPage = !isLanding && !isAuth;

  // Shared User Profile or Login Button
  const AuthNavBox = () => (
    <div className="relative" ref={dropdownRef}>
      {userInfo ? (
        <div className="flex items-center gap-4">
          <div className="relative group flex items-center justify-center bg-gray-800 rounded-full w-10 h-10 border border-gray-700 hover:border-red-500 cursor-pointer transition shadow-md">
            <svg width="20" height="20" className="text-gray-300 group-hover:text-red-400 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            <div className="absolute top-12 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl border border-gray-700 z-50">
              Wallet: ₹{userInfo.walletBalance?.toLocaleString() || '20,000'}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white cursor-pointer hover:bg-red-700 transition shadow-lg border border-red-500/30"
            >
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </div>

            <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-white font-medium truncate">{userInfo.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{userInfo.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center mt-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700/50 hover:text-red-400 transition-colors flex items-center mt-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      ) : (
        <Link to="/auth">
          <button className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 transition text-white font-medium shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            Login
          </button>
        </Link>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111827]/90 backdrop-blur-md border-b border-gray-800 shadow-md">
      <div className="flex items-center px-8 py-4">
        {isAuth && (
          <div className="w-full flex justify-center">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              Bid<span className="text-red-600">Nest</span>
            </Link>
          </div>
        )}

        {isLanding && (
          <>
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              Bid<span className="text-red-600">Nest</span>
            </Link>

            <div className="ml-auto flex items-center gap-8 text-gray-300">
              <a href="#about" className="hover:text-white transition font-medium text-sm">
                About
              </a>

              <Link to="/dashboard" className="hover:text-white transition font-medium text-sm">
                Explore
              </Link>

              <a href="#contact" className="hover:text-white transition font-medium text-sm">
                Contact
              </a>

              <AuthNavBox />
            </div>
          </>
        )}

        {isAppPage && (
          <>
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              Bid<span className="text-red-600">Nest</span>
            </Link>

            <div className="ml-auto flex items-center gap-4">
              <AuthNavBox />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
