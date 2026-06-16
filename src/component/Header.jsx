import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingCart, LogOut } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { UserAuth } from "../context/AuthContext";

export default function Header() {
  const { getCartCount } = useContext(CartContext);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 md:px-20 bg-white fixed top-0 left-0 w-full text-black text-sm shadow-sm z-50 border-b border-gray-100">
      <Link to="/" className="font-extrabold text-xl tracking-wider text-[#F24E05]">
        RAVISH
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/" className="font-semibold text-gray-600 hover:text-[#F24E05] transition-colors">Home</Link>
        <Link to="/menu" className="font-semibold text-gray-600 hover:text-[#F24E05] transition-colors">Menu</Link>
        
        {/* Shopping Cart Link with Count Badge */}
        <Link to="/cart" className="relative p-1 text-gray-600 hover:text-[#F24E05] transition-colors">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#F24E05] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
        
        {/* Auth Icon Linking to Dashboard or Login */}
        <Link 
          to={session ? "/dashboard" : "/login"} 
          className="p-1 text-gray-600 hover:text-[#F24E05] transition-colors flex items-center gap-1 font-semibold"
          title={session ? "Go to Dashboard" : "Sign In"}
        >
          <User size={20} />
          {session && <span className="hidden sm:inline text-xs text-gray-500 max-w-[80px] truncate">{session.user.email}</span>}
        </Link>

        {/* Sign Out Shortcut if logged in */}
        {session && (
          <button
            onClick={handleSignOut}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
