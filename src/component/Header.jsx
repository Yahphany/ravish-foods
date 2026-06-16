import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingCart, LogOut, Bell } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { UserAuth } from "../context/AuthContext";

export default function Header() {
  const { getCartCount, orders } = useContext(CartContext);
  const { session, userRole, signOut } = UserAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Count prepared orders awaiting logistics dispatcher pickup
  const readyForDeliveryCount = orders.filter(
    (order) => order.status === "Ready for Delivery" && !order.dispatcherId
  ).length;

  // 1. VENDOR HEADER: Focuses strictly on orders dashboard and menu listings
  if (session && userRole === "vendor") {
    return (
      <div className="flex justify-between items-center py-4 px-6 md:px-20 bg-white fixed top-0 left-0 w-full text-black text-sm shadow-sm z-50 border-b border-gray-100">
        <Link to="/dashboard" className="font-extrabold text-xl tracking-wider text-[#F24E05]">
          RAVISH <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1.5 px-2.5 py-0.5 bg-gray-100 rounded-full align-middle">Vendor</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="font-bold text-gray-600 hover:text-[#F24E05] transition-colors">Dashboard</Link>
          <a href="/dashboard#inventory" className="font-bold text-gray-600 hover:text-[#F24E05] transition-colors">Listed Items / Inventory</a>
          
          {/* User Email Info Indicator */}
          <div className="p-1 text-gray-600 flex items-center gap-1 font-semibold border-l border-gray-200 pl-4">
            <User size={20} />
            <span className="hidden md:inline text-xs text-gray-500 max-w-[100px] truncate">{session.user.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    );
  }

  // 2. LOGISTICS HEADER: Contains dashboard link and prepared delivery notifications
  if (session && userRole === "logistics") {
    return (
      <div className="flex justify-between items-center py-4 px-6 md:px-20 bg-white fixed top-0 left-0 w-full text-black text-sm shadow-sm z-50 border-b border-gray-100">
        <Link to="/dashboard" className="font-extrabold text-xl tracking-wider text-[#F24E05]">
          RAVISH <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1.5 px-2.5 py-0.5 bg-gray-100 rounded-full align-middle">Logistics</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="font-bold text-gray-600 hover:text-[#F24E05] transition-colors">Dashboard</Link>
          
          {/* Notification bell showing available jobs */}
          <div className="relative p-1 text-gray-600 hover:text-[#F24E05] transition-colors cursor-pointer" title="Prepared Deliveries Feed">
            <Bell size={20} />
            {readyForDeliveryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F24E05] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                {readyForDeliveryCount}
              </span>
            )}
          </div>

          {/* User Email Info Indicator */}
          <div className="p-1 text-gray-600 flex items-center gap-1 font-semibold border-l border-gray-200 pl-4">
            <User size={20} />
            <span className="hidden md:inline text-xs text-gray-500 max-w-[100px] truncate">{session.user.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    );
  }

  // 3. BUYER / PUBLIC HEADER: Standard ecommerce navigation
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
