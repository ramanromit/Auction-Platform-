import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar";

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

      // Duplicate email check
      try {
        const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
        if (storedUser && storedUser.email === email) {
          newErrors.email = "User already exists with this email";
        }
      } catch {}
    }

    return newErrors;
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    if (isLogin) {
      // Login logic
      const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
      const email = formData.email.trim();
      const password = formData.password;

      if (storedUser && storedUser.email === email && storedUser.password === password) {
        localStorage.setItem("user", "true");
        setErrors({});
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setErrors({ general: "Invalid email or password" });
        setSuccess("");
      }
    } else {
      // Register logic
      const cleanedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      localStorage.setItem(
        "registeredUser",
        JSON.stringify({
          name: cleanedData.name,
          email: cleanedData.email,
          password: cleanedData.password,
        })
      );

      localStorage.setItem("user", "true");
      setErrors({});
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
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
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>

          </form>

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
