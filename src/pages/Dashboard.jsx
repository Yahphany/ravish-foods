import React, { useContext, useEffect, useState } from "react";
import Layout from "../component/Layout";
import { UserAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import VendorDashboard from "./VendorDashboard";
import LogisticsDashboard from "./LogisticsDashboard";
import { 
  Clock, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  MapPin, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { session, userRole, signOut } = UserAuth();
  const { orders, ordersLoading, cancelOrder, reorder } = useContext(CartContext);
  const navigate = useNavigate();
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const displayOrderId = (id) => {
    if (!id) return "";
    return id.startsWith("ORD-") ? id : `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  useEffect(() => {
    if (session === null) {
      navigate("/login");
    }
  }, [session, navigate]);

  // Loading spinner for auth initialization
  if (session === undefined || userRole === undefined) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-[#FDF5ED]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F24E05]"></div>
        </div>
      </Layout>
    );
  }

  // Filter active and past orders for buyers
  const activeOrders = orders.filter(
    (order) => order.status !== "Completed" && order.status !== "Cancelled"
  );
  const pastOrders = orders.filter(
    (order) => order.status === "Completed" || order.status === "Cancelled"
  );

  // Compute metrics for buyer
  const totalSpent = pastOrders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.total, 0);

  const handleReorderClick = (order) => {
    reorder(order);
    setFeedbackMsg(`Added items from ${displayOrderId(order.id)} back to your cart!`);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    const options = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <Layout>
      <div className="py-24 min-h-screen bg-[#FDF5ED] px-4 sm:px-6 md:px-10 lg:px-20 text-gray-800">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Toast / Feedback Banner */}
          {feedbackMsg && (
            <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 animate-slide-in">
              <CheckCircle2 size={20} />
              <span className="text-sm font-semibold">{feedbackMsg}</span>
            </div>
          )}

          {/* User profile header card (Shared across all dashboards) */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03] transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F24E05]/10 text-[#F24E05] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                  {userRole === "vendor" ? "Vendor Dashboard" : userRole === "logistics" ? "Logistics Dashboard" : "Customer Dashboard"}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Welcome Back,
                </h1>
                <p className="text-lg font-medium text-gray-600 mt-1 break-all">
                  {session?.user?.email}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {userRole === "vendor" ? "Publish your food menu options and package incoming orders in real-time." : 
                   userRole === "logistics" ? "Find shipping routes, accept packages, and complete customer deliveries." :
                   "Track your food orders, view history, and check your profile status here."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {userRole === "buyer" && (
                  <button
                    type="button"
                    onClick={() => navigate("/menu")}
                    className="rounded-full bg-[#F24E05] text-white px-6 py-3 font-semibold text-sm transition-all duration-200 hover:bg-[#D94100] active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer flex items-center gap-2"
                  >
                    Order Food <ArrowRight size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Dashboard Views based on Authenticated Role */}
          {userRole === "vendor" && <VendorDashboard />}
          {userRole === "logistics" && <LogisticsDashboard />}
          {userRole === "buyer" && (
            <>
              {/* Metrics summary cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
                  <div className="rounded-2xl bg-orange-50 p-4 text-[#F24E05]">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</p>
                    <p className="mt-1 text-2xl font-black text-gray-900">{activeOrders.length}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
                  <div className="rounded-2xl bg-green-50 p-4 text-green-600">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders Placed</p>
                    <p className="mt-1 text-2xl font-black text-gray-900">{orders.length}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
                  <div className="rounded-2xl bg-purple-50 p-4 text-purple-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</p>
                    <p className="mt-1 text-2xl font-black text-gray-900">₦{totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Active Orders List */}
              <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]">
                <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-4">
                  <Clock className="text-[#F24E05]" size={22} />
                  <h2 className="text-2xl font-bold text-gray-900">Current Pending & Active Orders</h2>
                </div>

                {activeOrders.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center">
                    <AlertCircle className="text-gray-300 mb-3" size={48} />
                    <h3 className="text-lg font-bold text-gray-800">No active orders right now</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">Place an order from our menu and track it here in real-time.</p>
                    <button
                      type="button"
                      onClick={() => navigate("/menu")}
                      className="rounded-full bg-gray-900 text-white hover:bg-black px-6 py-2.5 font-semibold text-sm transition cursor-pointer"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeOrders.map((order) => {
                      // Adjust status progress steps to fit the new multi-role flows
                      const statusSteps = ["Pending", "Preparing", "Ready for Delivery", "Out for Delivery"];
                      const currentStepIdx = statusSteps.indexOf(order.status);
                      
                      return (
                        <div key={order.id} className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
                          
                          {/* Order Info Row */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-lg text-gray-900">{displayOrderId(order.id)}</h3>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                  order.status === "Preparing" ? "bg-orange-100 text-orange-800" :
                                  order.status === "Ready for Delivery" ? "bg-blue-100 text-blue-800" :
                                  "bg-indigo-100 text-indigo-800"
                                }`}>
                                  {order.status === "Ready for Delivery" ? "Packaged (Awaiting Courier)" : 
                                   order.status === "Out for Delivery" ? "On the Way" : order.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                            </div>
                            <div className="text-right sm:text-right text-left">
                              <p className="text-xs text-gray-400">Total Price</p>
                              <p className="text-lg font-black text-[#F24E05] mt-0.5">₦{order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Items Ordered */}
                          <div className="mb-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Items Ordered</p>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, idx) => (
                                <span 
                                  key={idx} 
                                  className="rounded-xl bg-white border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-700 flex items-center gap-2 shadow-sm"
                                >
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-5 h-5 rounded-full object-cover" />
                                  )}
                                  <span>{item.name} <strong className="text-[#F24E05]">x{item.quantity}</strong></span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Visual Progress Stepper */}
                          <div className="mb-6">
                            <div className="relative flex items-center justify-between w-full">
                              
                              {/* Progress Line Background */}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                              
                              {/* Active Progress Line */}
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#F24E05] -z-10 rounded-full transition-all duration-500"
                                style={{ width: `${currentStepIdx >= 0 ? (currentStepIdx / (statusSteps.length - 1)) * 100 : 0}%` }}
                              ></div>

                              {/* Steps */}
                              {statusSteps.map((step, idx) => {
                                const isCompleted = idx < currentStepIdx;
                                const isActive = idx === currentStepIdx;
                                return (
                                  <div key={idx} className="flex flex-col items-center bg-[#FDF5ED] sm:bg-white rounded-full p-1 border border-transparent">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                      isCompleted ? "bg-[#F24E05] text-white" :
                                      isActive ? "bg-white border-2 border-[#F24E05] text-[#F24E05] scale-110 shadow-md" :
                                      "bg-gray-100 text-gray-400 border border-gray-200"
                                    }`}>
                                      {isCompleted ? "✓" : idx + 1}
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-bold mt-2 ${
                                      isActive ? "text-[#F24E05]" : "text-gray-400"
                                    }`}>
                                      {step === "Ready for Delivery" ? "Packaged" : step === "Out for Delivery" ? "On the Way" : step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Cancel Order Action */}
                          {order.status === "Pending" && (
                            <div className="flex justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => cancelOrder(order.id)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full px-4.5 py-2 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <XCircle size={14} /> Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order History Card */}
              <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]">
                <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-4">
                  <Package className="text-gray-500" size={22} />
                  <h2 className="text-2xl font-bold text-gray-900 font-sans">Order History</h2>
                </div>

                {pastOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                    <HelpCircle size={40} className="text-gray-200 mb-2" />
                    <p className="text-sm">No order history available.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                          <th className="py-4 font-semibold">Order ID</th>
                          <th className="py-4 font-semibold">Date</th>
                          <th className="py-4 font-semibold">Items</th>
                          <th className="py-4 font-semibold text-right">Total</th>
                          <th className="py-4 font-semibold text-center">Status</th>
                          <th className="py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {pastOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                            <td className="py-4 font-extrabold text-gray-900">{displayOrderId(order.id)}</td>
                            <td className="py-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.date)}</td>
                            <td className="py-4 max-w-xs truncate text-gray-600 font-medium">
                              {order.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                            </td>
                            <td className="py-4 text-right font-black text-gray-900 whitespace-nowrap">₦{order.total.toFixed(2)}</td>
                            <td className="py-4 text-center whitespace-nowrap">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleReorderClick(order)}
                                className="rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-1.5 text-xs font-bold transition cursor-pointer"
                              >
                                Reorder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}
