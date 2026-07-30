import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "../components/navbar";

const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : `http://${window.location.hostname}:5000`;

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user types
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      delete copy.general;
      return copy;
    });
  };

  // Validation
  const validateForm = (data) => {
    const newErrors = {};

    // Email Validation (for both login and register)
    const email = data.email.trim();
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password Validation (for both login and register)
    const password = data.password;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }

    // Additional validation for register mode
    if (!isLogin) {
      // Name Validation
      const nameRaw = data.name;
      const name = data.name.trim();
      
      if (!name) {
        newErrors.name = "Full name is required";
      } else if (nameRaw !== nameRaw.trimStart()) {
        newErrors.name = "Name cannot start with blank spaces";
      } else if (name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      } else if (!/^[A-Za-z]+(\s[A-Za-z]+)*$/.test(name)) {
        newErrors.name = "Name can only contain letters and spaces between names";
      }

      // Confirm Password Validation
      const confirmPassword = data.confirmPassword;
      if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    setLoading(true);

    if (isLogin) {
      // Login logic via axios
      try {
        const config = {
          headers: { 'Content-type': 'application/json' },
        };
        const { data } = await axios.post(
          `${BASE_URL}/api/users/login`,
          { email: formData.email.trim(), password: formData.password },
          config
        );

        localStorage.setItem("userInfo", JSON.stringify(data));
        setErrors({});
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        setErrors({ general: error.response && error.response.data.message ? error.response.data.message : error.message });
        setSuccess("");
      }
    } else {
      // Register logic via axios
      try {
        const config = {
          headers: { 'Content-type': 'application/json' },
        };
        const { data } = await axios.post(
          `${BASE_URL}/api/users`,
          { name: formData.name.trim(), email: formData.email.trim(), password: formData.password },
          config
        );

        localStorage.setItem("userInfo", JSON.stringify(data));
        setErrors({});
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        setErrors({ general: error.response && error.response.data.message ? error.response.data.message : error.message });
        setSuccess("");
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccess("");
    
    if (isLogin) {
      navigate("/auth?mode=register");
    } else {
      navigate("/auth?mode=login");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const config = { headers: { 'Content-type': 'application/json' } };
      const { data } = await axios.post(
        `${BASE_URL}/api/users/google`,
        { token: credentialResponse.credential, isLogin },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setErrors({});
      setSuccess(isLogin ? "Google Login successful! Redirecting..." : "Google Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google authentication failed';
      setErrors({ general: errorMessage });
      
      // Auto-switch to register mode if trying to login without an account
      if (errorMessage.includes("Account does not exist") && isLogin) {
         setTimeout(() => {
           setErrors({});
           navigate("/auth?mode=register");
         }, 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: "Google Sign In was unsuccessful. Try again." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0505] via-[#111827] to-[#1a0505]">
      <Navbar />

      <div className="flex items-center justify-center pt-32 px-6">

        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            {isLogin ? "Login" : "Register"}
          </h2>

          <p className="text-center text-gray-400 mb-8">
            {isLogin
              ? "Login to continue bidding"
              : "Create an account to start bidding"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.name ? "border-red-500" : "border-white/10"
                  } text-white focus:outline-none focus:border-red-400 transition`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm -mt-2">{errors.name}</p>
                )}
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                errors.email ? "border-red-500" : "border-white/10"
              } text-white focus:outline-none focus:border-red-400 transition`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm -mt-2">{errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                errors.password ? "border-red-500" : "border-white/10"
              } text-white focus:outline-none focus:border-red-400 transition`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm -mt-2">{errors.password}</p>
            )}

            {!isLogin && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.confirmPassword ? "border-red-500" : "border-white/10"
                  } text-white focus:outline-none focus:border-red-400 transition`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm -mt-2">{errors.confirmPassword}</p>
                )}
              </>
            )}

            {success && (
              <p className="text-green-500 text-sm text-center">{success}</p>
            )}

            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Processing..." : (isLogin ? "Login" : "Register")}
            </button>

          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute left-0 right-0 h-px bg-white/10"></div>
            <span className="bg-[#1a0505] px-4 text-sm text-gray-400 relative z-10">Or</span>
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </div>

          <p className="text-gray-400 text-center mt-6">
            {isLogin
              ? "Not registered?"
              : "Already have an account?"}

            <button
              onClick={switchMode}
              className="ml-2 text-red-500 hover:text-red-400 font-semibold"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}
