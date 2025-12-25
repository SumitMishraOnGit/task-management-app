import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlobbyBackground from "../components/ui/BlobbyBackground.jsx";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-900">
      <div className="relative z-10 h-full flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-6xl h-full max-h-[48rem] flex rounded-2xl overflow-hidden border border-neutral-800">
          <div className="w-full md:w-1/2 h-full flex-col items-center justify-center p-8 hidden md:flex relative overflow-hidden">
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
          <div className="w-full md:w-1/2 h-full bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Sign Up</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-neutral-700/50 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>
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
                  className={`w-full p-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-100"
                    }`}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-pulse">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm animate-pulse">
                  Signup successful! Redirecting to login...
                </div>
              )}
              <div className="mt-6 text-center text-neutral-400">
                Already have an account?{" "}
                <Link to="/login" className="text-rose-500 hover:text-rose-400 font-medium">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 