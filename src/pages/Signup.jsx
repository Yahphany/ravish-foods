import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("buyer"); // 'buyer' (default), 'vendor', 'logistics'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // Track whether the registration is complete but pending email verification
  const [isRegistered, setIsRegistered] = useState(false);

  const { signUpNewUser } = UserAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Client-side confirmation check
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Trigger Supabase sign up with role and display name
      const result = await signUpNewUser(
        email,
        password,
        role,
        displayName,
        phone,
      );

      if (result.success) {
        // If email confirmation is DISABLED in Supabase provider dashboard,
        // Supabase returns a session immediately upon sign up.
        if (result.data?.session) {
          setSuccess("Registration successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // If email confirmation is ENABLED (Supabase default), no session is returned yet.
          // The user must verify their email before accessing authenticated routes.
          setIsRegistered(true);
        }
      } else {
        // Handle database or credential constraints returned by Supabase auth
        setError(
          result.error?.message ||
            "An error occurred during sign-up. Please try again.",
        );
      }
    } catch (err) {
      setError("An error occurred during sign-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If successfully registered but requires email confirmation, show instructions
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5ED] font-sans p-4">
        <div className="w-full max-w-[440px] bg-white rounded-[20px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] border border-black/[0.05] text-center space-y-6 animate-scale-up">
          <div className="flex justify-center">
            <div className="w-[68px] h-[68px] bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm">
              {/* SVG Mail bounce icon for high quality UX */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 animate-bounce"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[26px] font-semibold text-gray-800 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500">
              We have sent a verification link to your email: <br />
              <strong className="text-gray-700 break-all">{email}</strong>
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-left">
            <p className="text-xs text-orange-800 leading-relaxed font-medium">
              💡 <strong>Note:</strong> You must click the confirmation link in
              the email to activate your account before you can log in. Remember
              to check your Spam folder if you can't find it.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full bg-[#F24E05] hover:bg-[#D94100] text-white rounded-[10px] py-3.5 text-base font-semibold transition-all duration-200 shadow-sm block text-center cursor-pointer"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5ED] font-sans p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] border border-black/[0.05] text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.04),0_3px_6px_rgba(0,0,0,0.02)]">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="w-[68px] h-[68px] bg-[#F24E05] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(242,78,5,0.2)] transition-transform duration-300 hover:scale-105 hover:rotate-6">
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
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Sign up to get started on RAVISH
        </p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-left">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl text-left">
            {success}
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-5 text-left">
          {/* Display Name / Shop Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="displayName"
              className="text-sm font-semibold text-gray-800"
            >
              {role === "vendor" ? "Vendor / Restaurant Name" : "Display Name"}
            </label>
            <input
              type="text"
              id="displayName"
              placeholder={
                role === "vendor" ? "e.g. Iya Basira Kitchen" : "e.g. John Doe"
              }
              className="w-full bg-gray-100 border border-transparent rounded-[10px] px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] focus:ring-4 focus:ring-[#F24E05]/10 outline-none transition-all duration-200"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          {/* Account Role Selector Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Register As
            </label>
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
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full bg-gray-100 border border-transparent rounded-[10px] px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] focus:ring-4 focus:ring-[#F24E05]/10 outline-none transition-all duration-200"
              required
              value={email}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-gray-800"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              className="w-full bg-gray-100 border border-transparent rounded-[10px] px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] focus:ring-4 focus:ring-[#F24E05]/10 outline-none transition-all duration-200"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F24E05] hover:bg-[#D94100] active:bg-[#C03600] text-white rounded-[10px] py-3.5 text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-[0_4px_12px_rgba(242,78,5,0.25)] active:translate-y-[1px] flex justify-center items-center mt-2 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-7 text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            to="/login"
            className="text-[#F24E05] font-semibold hover:underline hover:text-[#D94100] transition-colors duration-200"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
