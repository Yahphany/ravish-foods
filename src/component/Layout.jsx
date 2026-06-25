import React, { useContext } from "react";
import Header from "./Header";
import { CartContext } from "../context/CartContext";
import { Bell } from "lucide-react";

export default function Layout({ children }) {
  const { toastMessage } = useContext(CartContext);

  return (
    <div className="relative">
      <Header />
      {children}

      {/* Global Real-time Notification Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm animate-[slideIn_0.3s_ease-out]">
          {/* Custom SlideIn keyframes style if not in tailwind CSS config */}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>

          <div className="rounded-xl bg-[#F24E05]/20 text-[#F24E05] p-2 shrink-0">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#F24E05] uppercase tracking-wider">
              Alert Notification
            </span>
            <span className="text-sm font-semibold text-gray-100 mt-0.5">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
