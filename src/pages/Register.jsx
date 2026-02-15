import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard");
  }, [navigate]);

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

    const name = data.name.trim();
    const email = data.email.trim();
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    // Name
    if (!name) newErrors.name = "Full name is required";
    else if (name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    else if (!/^[A-Za-z][A-Za-z' -]*$/.test(name))
      newErrors.name = "Only letters, spaces, - or ' allowed";

    // Email
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter valid email";

    // Password
    if (!password) newErrors.password = "Password required";
    else if (password.length < 8)
      newErrors.password = "Password must be 8+ characters";
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password))
      newErrors.password = "Must contain letter & number";

    // Confirm Password
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // Duplicate email check
    try {
      const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
      if (storedUser && storedUser.email === email) {
        newErrors.email = "User already exists";
      }
    } catch {}

    return newErrors;
  };

  // Submit
  const handleRegister = (e) => {
    e.preventDefault();

    const cleanedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const validationErrors = validateForm(cleanedData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    // Save user
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        name: cleanedData.name,
        email: cleanedData.email,
        password: cleanedData.password,
      })
    );

    setErrors({});
    setSuccess("Registration successful! Redirecting...");

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]">
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleRegister}
        className="bg-[#1f2937] p-10 rounded-2xl w-[420px] shadow-2xl border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-[#DC2626] mb-2 text-center">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Join and start bidding today
        </p>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-1 p-3 rounded bg-[#111827] text-white border border-gray-600"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name}</p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="new-email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-1 p-3 rounded bg-[#111827] text-white border border-gray-600"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-1 p-3 rounded bg-[#111827] text-white border border-gray-600"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mb-1 p-3 rounded bg-[#111827] text-white border border-gray-600"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-3">
            {errors.confirmPassword}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition duration-300 mt-2"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
