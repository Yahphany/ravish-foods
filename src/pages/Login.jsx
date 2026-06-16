import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Form field states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // 'buyer' (default), 'vendor', 'logistics'

  // UI feedback states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // boolean, not string

  // Pull signInUser and session from the global auth context
  const { session, signInUser } = UserAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors before each attempt

    try {
      // Call Supabase signInWithPassword through our auth context wrapper with the expected role
      const result = await signInUser(email, password, role);

      if (result && result.success) {
        // Login successful — navigate to the user's dashboard
        navigate("/dashboard");
      } else {
        // Surface the exact Supabase or role-checking error message to the user
        setError(result?.error?.message || "Invalid login credentials.");
      }
    } catch (err) {
      // Catch unexpected runtime errors (network failures, etc.)
      setError("An error occurred during sign-in. Please try again.");
    } finally {
      // Always reset the loading state when the request completes
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5ED] font-sans p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] border border-black/[0.05] text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.04),0_3px_6px_rgba(0,0,0,0.02)]">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="w-[68px] h-[68px] bg-[#F24E05] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(242,78,5,0.2)] transition-transform duration-300 hover:scale-105 hover:rotate-6">
            {/* Crossed Knife and Fork SVG */}
            <svg viewBox="0 0 100 100" className="w-9 h-9">
              {/* Knife */}
              <g transform="translate(50,50) rotate(-45) translate(-50,-50)">
                <path
                  d="M47,20 C47,20 49,25 49,38 L49,55 L45,55 L45,20 Z"
                  fill="white"
                />
                <rect
                  x="45.5"
                  y="58"
                  width="3"
                  height="22"
                  rx="1.5"
                  fill="white"
                />
                <rect
                  x="44.5"
                  y="55"
                  width="5"
                  height="3"
                  rx="0.5"
                  fill="white"
                />
              </g>
              {/* Fork */}
              <g transform="translate(50,50) rotate(45) translate(-50,-50)">
                <path d="M48,38 L52,38 L51,55 L49,55 Z" fill="white" />
                <path
                  d="M45,20 L45,35 C45,38 55,38 55,35 L55,20"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="48.3"
                  y1="20"
                  x2="48.3"
                  y2="35"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="51.7"
                  y1="20"
                  x2="51.7"
                  y2="35"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <rect
                  x="48.5"
                  y="58"
                  width="3"
                  height="22"
                  rx="1.5"
                  fill="white"
                />
                <rect
                  x="47.5"
                  y="55"
                  width="5"
                  height="3"
                  rx="0.5"
                  fill="white"
                />
              </g>
            </svg>
          </div>
        </div>

        <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
          
          {/* Account Role Selector Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Login As</label>
            <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
              {["buyer", "vendor", "logistics"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    role === r
                      ? "bg-[#F24E05] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 bg-transparent"
                  }`}
                >
                  {r === "logistics" ? "Logistics" : r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-800"
              
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full bg-gray-100 border border-transparent rounded-[10px] px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] focus:ring-4 focus:ring-[#F24E05]/10 outline-none transition-all duration-200"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full bg-gray-100 border border-transparent rounded-[10px] px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] focus:ring-4 focus:ring-[#F24E05]/10 outline-none transition-all duration-200"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F24E05] hover:bg-[#D94100] active:bg-[#C03600] text-white rounded-[10px] py-3.5 text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-[0_4px_12px_rgba(242,78,5,0.25)] active:translate-y-[1px] flex justify-center items-center mt-2 cursor-pointer"
            disabled={loading}
          >
            Sign In
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="mt-7 text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-[#F24E05] font-semibold hover:underline hover:text-[#D94100] transition-colors duration-200"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
