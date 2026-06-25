import React, { useContext, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Package,
  List,
  Navigation,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export default function LogisticsDashboard() {
  const { session } = UserAuth();
  const {
    orders,
    claimOrderForDelivery,
    updateOrderStatus,
    updateDispatcherLocation,
    ordersLoading,
  } = useContext(CartContext);

  const [activeTab, setActiveTab] = useState("available"); // "available", "active", "completed"

  // Filter orders by delivery dispatcher status
  // 1. Available to claim: ready to ship out and has no driver assigned
  const availableOrders = orders.filter(
    (order) => order.status === "Ready for Delivery" && !order.dispatcherId,
  );

  // 2. Active claim: out for delivery and assigned to this user
  const myActiveOrders = orders.filter(
    (order) =>
      order.status === "Out for Delivery" &&
      order.dispatcherId === session?.user?.id,
  );

  // Real-time location tracking for logistics users with active orders
  React.useEffect(() => {
    if (myActiveOrders.length === 0) return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Broadcasting location update:", latitude, longitude);

          for (const order of myActiveOrders) {
            await updateDispatcherLocation(order.id, latitude, longitude);
          }
        },
        (error) => {
          console.error("Error watching geolocation position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        },
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [myActiveOrders, updateDispatcherLocation]);

  // Helper to slice and display order IDs cleanly
  const displayOrderId = (id) => {
    return id.startsWith("ORD-") ? id : `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  // 3. Completed: delivered by this dispatcher
  const myCompletedOrders = orders.filter(
    (order) =>
      order.status === "Completed" && order.dispatcherId === session?.user?.id,
  );

  // Compute metrics
  const totalEarnings = myCompletedOrders.reduce(
    (sum, order) => sum + (order.deliveryFee || 500),
    0,
  );

  // Handle claiming an order for delivery
  const handleClaimOrder = async (orderId) => {
    try {
      await claimOrderForDelivery(orderId, session.user.id);
    } catch (err) {
      console.error("Failed to claim order:", err);
    }
  };

  // Handle marking an order as delivered
  const handleDeliverOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "Completed");
    } catch (err) {
      console.error("Failed to update status to delivered:", err);
    }
  };

  // Format date strings
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Available Deliveries
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              {availableOrders.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Deliveries
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              {myActiveOrders.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-[#F24E05]/10 text-[#F24E05]">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Delivery Revenue
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              ₦{totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-black/[0.03] shadow-sm flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("available")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold capitalize transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "available"
              ? "bg-[#F24E05] text-white shadow-md shadow-orange-500/10"
              : "text-gray-500 hover:text-gray-900 bg-transparent"
          }`}
        >
          <List size={16} /> Available Jobs ({availableOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold capitalize transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "active"
              ? "bg-[#F24E05] text-white shadow-md shadow-orange-500/10"
              : "text-gray-500 hover:text-gray-900 bg-transparent"
          }`}
        >
          <Navigation size={16} /> My Active Routes ({myActiveOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold capitalize transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "completed"
              ? "bg-[#F24E05] text-white shadow-md shadow-orange-500/10"
              : "text-gray-500 hover:text-gray-900 bg-transparent"
          }`}
        >
          <CheckCircle2 size={16} /> History ({myCompletedOrders.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]">
        {/* Loading Spinner */}
        {ordersLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F24E05]"></div>
          </div>
        )}

        {/* 1. AVAILABLE DELIVERIES LIST */}
        {!ordersLoading && activeTab === "available" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Truck className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">
                Available Prepared Deliveries
              </h2>
            </div>

            {availableOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <AlertCircle className="text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-gray-800">
                  No shipments ready for dispatch
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Check back later once vendors package and prepare customer
                  orders.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {availableOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* ID & Date */}
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                        <div>
                          <h3 className="font-extrabold text-base text-gray-900">
                            {displayOrderId(order.id)}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Delivery Payout
                          </p>
                          <p className="text-sm font-black text-[#F24E05]">
                            ₦{(order.deliveryFee || 500).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <MapPin
                          size={14}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            Delivery Address
                          </p>
                          <p className="mt-0.5 leading-relaxed">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      {/* Items quantity */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-100">
                        <Package size={14} className="text-gray-400" />
                        <span>
                          Contains{" "}
                          <strong className="text-gray-800">
                            {order.items.reduce(
                              (sum, i) => sum + i.quantity,
                              0,
                            )}{" "}
                            food items
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimOrder(order.id)}
                      className="w-full bg-[#F24E05] hover:bg-[#D94100] text-white py-3 rounded-xl text-sm font-bold transition mt-5 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Navigation size={14} /> Accept Delivery Route
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. MY ACTIVE ROUTES */}
        {!ordersLoading && activeTab === "active" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Navigation className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">
                Your Active Route
              </h2>
            </div>

            {myActiveOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <AlertCircle className="text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-gray-800">
                  No active deliveries currently
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Accept a delivery route from the "Available Jobs" tab to start
                  earning.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {myActiveOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left: Info details */}
                      <div className="space-y-4 text-left">
                        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                          <div>
                            <h3 className="font-extrabold text-lg text-gray-900">
                              {displayOrderId(order.id)}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            Out for Delivery
                          </span>
                        </div>

                        {/* Customer Info Card */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Recipient Contact
                          </p>

                          <div className="flex items-center gap-3 text-xs">
                            <User
                              size={14}
                              className="text-gray-400 shrink-0"
                            />
                            <span className="font-bold text-gray-800">
                              {order.customer?.displayName || "Anonymous"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <Mail
                              size={14}
                              className="text-gray-400 shrink-0"
                            />
                            <span className="text-gray-500">
                              {order.customer?.email}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <Phone
                              size={14}
                              className="text-gray-400 shrink-0"
                            />
                            <span className="text-gray-800 font-semibold">
                              {order.customer?.phone || "No phone provided"}
                            </span>
                          </div>
                        </div>

                        {/* Destination Address */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-600">
                          <MapPin
                            size={16}
                            className="text-[#F24E05] mt-0.5 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-800">
                              Destination Address
                            </p>
                            <p className="mt-1 leading-relaxed text-gray-700 font-medium">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Items & Actions */}
                      <div className="flex flex-col justify-between space-y-4">
                        {/* Package Contents */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Package Contents
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                              >
                                <span className="font-semibold text-gray-700">
                                  {item.name}
                                </span>
                                <span className="font-black text-gray-900 bg-gray-100 rounded px-2 py-0.5">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Complete Delivery Action */}
                        <button
                          type="button"
                          onClick={() => handleDeliverOrder(order.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={16} /> Mark as Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. HISTORY */}
        {!ordersLoading && activeTab === "completed" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <CheckCircle2 className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">
                Your Delivery History
              </h2>
            </div>

            {myCompletedOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <AlertCircle className="text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-gray-800">
                  No completed jobs yet
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Deliver accepted orders to compile your shipment history.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myCompletedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/30"
                  >
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-gray-900">
                        {displayOrderId(order.id)}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Delivered: {formatDate(order.date)}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px] sm:max-w-none mt-1">
                        📍 {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Earned</p>
                      <p className="font-black text-sm text-green-600">
                        +₦{(order.deliveryFee || 500).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
