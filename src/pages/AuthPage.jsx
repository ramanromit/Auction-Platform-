import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("user", "true");
    navigate("/dashboard");
  };

  const switchMode = () => {
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

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-red-500"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-red-500"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-red-500"
              />
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
