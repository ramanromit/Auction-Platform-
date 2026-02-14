import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]);

  const isLanding = location.pathname === "/";
  const isAuth = location.pathname === "/auth";
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111827] shadow-md">
      <div className="flex items-center px-8 py-4">

        {isAuth && (
          <div className="w-full flex justify-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Bid<span className="text-red-600">Nest</span>
            </Link>
          </div>
        )}

        {isLanding && (
          <>
            <Link to="/" className="text-2xl font-bold text-white">
              Bid<span className="text-red-600">Nest</span>
            </Link>

            <div className="ml-auto flex items-center gap-6 text-gray-300">
              <a href="#about" className="hover:text-white transition">
                About
              </a>

              <Link to="/dashboard" className="hover:text-white transition">
                Explore
              </Link>

              <a href="#contact" className="hover:text-white transition">
                Contact
              </a>

              <Link to="/auth">
                <button className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition text-white">
                  Login
                </button>
              </Link>
            </div>
          </>
        )}

        {/* DASHBOARD PAGE */}
        {isDashboard && (
          <>
            <Link to="/" className="text-2xl font-bold text-white">
              Bid<span className="text-red-600">Nest</span>
            </Link>

            <div className="ml-auto flex items-center gap-4">

              {isLoggedIn ? (
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold cursor-pointer">
                  R
                </div>
              ) : (
                <Link to="/auth">
                  <button className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition text-white">
                    Login
                  </button>
                </Link>
              )}

            </div>
          </>
        )}

      </div>
    </nav>
  );
}
