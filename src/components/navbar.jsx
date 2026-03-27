import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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
        <div>
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
