import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlobbyBackground from "../components/ui/BlobbyBackground.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Connecting to API at:", import.meta.env.VITE_API_BASE_URL);

  // Handles the form submission for logging in.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid response from server");
      }

      // Save both tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      setError("");
      
      // Navigate to dashboard with correct path
      navigate("/home/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-900">
      <div className="relative z-10 h-full flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-6xl h-full max-h-[48rem] flex rounded-2xl overflow-hidden ring-1 ring-neutral-800">
          {/* Left Side: Now opaque, with the blobby background contained within it. A right border is added to create the dividing line. */}
          <div className="w-full md:w-1/2 h-full flex-col items-center justify-center p-8 hidden md:flex relative overflow-hidden border-r border-neutral-800">
            <div className="absolute inset-0 z-0 overflow-hidden">
               <BlobbyBackground />
            </div>
            <div className="relative z-10 text-center">
                <h1
                  className="text-white text-5xl lg:text-6xl text-center leading-tight font-bold"
                >
                  Rise Together,<br />Build More.
                </h1>
                <p className="text-neutral-300 mt-4 text-center max-w-sm">
                  Join our community and start collaborating on amazing projects today.
                </p>
            </div>
          </div>

          {/* Right Side: The login form  */}
          <div className="w-full md:w-1/2 h-full bg-neutral-900/70 rounded-2xl border border-neutral-700 backdrop-blur-sm flex items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-neutral-700/50 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-neutral-700/50 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full p-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors duration-300 ease-in-out ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-100"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-pulse">
                  {error}
                </div>
              )}
              <div className="mt-6 text-center text-neutral-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-rose-500 hover:text-rose-400 font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
