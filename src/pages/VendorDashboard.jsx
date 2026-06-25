import React, { useContext, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { MenuContext } from "../context/MenuContext";
import {
  Plus,
  ChefHat,
  Clock,
  Package,
  CheckCircle2,
  TrendingUp,
  User,
  MapPin,
  Phone,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function VendorDashboard() {
  const { session } = UserAuth();
  const { orders, updateOrderStatus, ordersLoading } = useContext(CartContext);
  const { dbMenuItems, addMenuItem, toggleMenuItemAvailability } =
    useContext(MenuContext);

  // Form states for adding a new menu item
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Rice Dishes");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);

  const categories = [
    "Rice Dishes",
    "Soups & Stews",
    "Swallow",
    "Snacks & Pastries",
    "Grills & Proteins",
    "Porridges & Legumes",
    "Sides & Breakfast",
    "Beverages",
  ];

  // Helper to slice and display order IDs cleanly
  const displayOrderId = (id) => {
    return id.startsWith("ORD-") ? id : `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  // Filter menu items listed by this specific vendor
  const vendorItems = dbMenuItems.filter(
    (item) => item.vendor_id === session?.user?.id,
  );

  // Vendor orders (since checkout groups orders by vendor, we can filter orders by vendorId)
  const vendorOrders = orders.filter(
    (order) => order.vendorId === session?.user?.id,
  );

  // Metrics computation
  const activeOrders = vendorOrders.filter(
    (o) => o.status === "Pending" || o.status === "Preparing",
  );
  const readyOrders = vendorOrders.filter(
    (o) => o.status === "Ready for Delivery" || o.status === "Out for Delivery",
  );
  const completedOrdersCount = vendorOrders.filter(
    (o) => o.status === "Completed",
  ).length;

  const totalEarnings = vendorOrders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.total, 0);

  // Handle addition of a food item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setAdding(true);
    setFormError("");
    setFormSuccess("");

    if (!name || !price) {
      setFormError("Food item name and price are required.");
      setAdding(false);
      return;
    }

    try {
      const result = await addMenuItem({
        name,
        price,
        category,
        description,
        image:
          image ||
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop", // high-res default placeholder
        vendor_id: session.user.id,
      });

      if (result.success) {
        setFormSuccess("Food item successfully added to menu!");
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
      } else {
        setFormError(result.error?.message || "Failed to add food item.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
    } finally {
      setAdding(false);
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
      {/* Metrics Summary Rows */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Kitchen Queue
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              {activeOrders.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Ready / Shipping
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              {readyOrders.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-green-50 p-4 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Completed Deliveries
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              {completedOrdersCount}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.02] flex items-center gap-4">
          <div className="rounded-2xl bg-[#F24E05]/10 p-4 text-[#F24E05]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Earnings
            </p>
            <p className="mt-1 text-2xl font-black text-gray-900">
              ₦{totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Section: Incoming Orders Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]">
            <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-4">
              <ChefHat className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">
                Active Incoming Orders
              </h2>
            </div>

            {ordersLoading && vendorOrders.length === 0 ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F24E05]"></div>
              </div>
            ) : vendorOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <AlertCircle className="text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-gray-800">
                  No active orders yet
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  When buyers order your dishes, they will appear here in
                  real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {vendorOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Header info */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-lg text-gray-900">
                            {displayOrderId(order.id)}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Preparing"
                                  ? "bg-orange-100 text-orange-800"
                                  : order.status === "Ready for Delivery"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "Out for Delivery"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : order.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === "Preparing"
                              ? "Preparing (Packaging)"
                              : order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400">Payout</p>
                        <p className="text-lg font-black text-[#F24E05]">
                          ₦{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Requested Dish
                      </p>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                              )}
                              <span className="font-semibold text-gray-800">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-extrabold text-gray-900 text-base">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Customer Info */}
                    <div className="grid gap-3 sm:grid-cols-2 text-xs text-gray-600 bg-white p-4 rounded-xl border border-gray-100 mb-5">
                      <div className="flex items-start gap-2">
                        <User size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-800">Customer</p>
                          <p className="mt-0.5">
                            {order.customer?.displayName || "Anonymous"}
                          </p>
                          <p className="text-gray-400">
                            {order.customer?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-800">Deliver To</p>
                          <p className="mt-0.5 leading-relaxed">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick status instructions & actions */}
                    {order.status === "Pending" && (
                      <div className="flex flex-col gap-3">
                        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 p-3.5 rounded-xl font-medium">
                          ⚠️ <strong>Action Required:</strong> A buyer has
                          requested this food. Accept this order to let them
                          know you are packaging the food.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.id, "Preparing")
                          }
                          className="w-full bg-[#F24E05] hover:bg-[#D94100] text-white py-3 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer"
                        >
                          Accept & Start Preparing
                        </button>
                      </div>
                    )}

                    {order.status === "Preparing" && (
                      <div className="flex flex-col gap-3">
                        <p className="text-xs text-orange-700 bg-orange-50 border border-orange-100 p-3.5 rounded-xl font-medium">
                          🍳 <strong>Kitchen Status:</strong> Please package the
                          requested food item. Once fully packed and ready for
                          delivery, click the button below to notify Logistics.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.id, "Ready for Delivery")
                          }
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer"
                        >
                          Ready to Ship Out
                        </button>
                      </div>
                    )}

                    {order.status === "Ready for Delivery" && (
                      <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100 p-3.5 rounded-xl font-medium">
                        ⏳ <strong>Awaiting Logistics:</strong> Order marked as
                        packaged. Waiting for a dispatch rider to accept the
                        delivery route.
                      </div>
                    )}

                    {order.status === "Out for Delivery" && (
                      <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl font-medium">
                        🛵 <strong>On the Way:</strong> A dispatch rider has
                        picked up the food and is delivering it to the customer.
                      </div>
                    )}

                    {order.status === "Completed" && (
                      <div className="text-xs text-green-700 bg-green-50 border border-green-100 p-3.5 rounded-xl font-medium flex items-center gap-2">
                        <CheckCircle2 size={14} />{" "}
                        <strong>Order Completed:</strong> Food delivered
                        successfully! Earnings added.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Add New Dish Form & Menu List */}
        <div className="space-y-6">
          {/* Add menu item form */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Plus className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">Add New Dish</h2>
            </div>

            {formSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddItem} className="space-y-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="foodName"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Food Name
                </label>
                <input
                  type="text"
                  id="foodName"
                  placeholder="e.g. Asun Fried Rice"
                  className="w-full bg-gray-100 border border-transparent rounded-[10px] px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] outline-none transition"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="foodPrice"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    id="foodPrice"
                    placeholder="e.g. 3500"
                    className="w-full bg-gray-100 border border-transparent rounded-[10px] px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] outline-none transition"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="foodCategory"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </label>
                  <select
                    id="foodCategory"
                    className="w-full bg-gray-100 border border-transparent rounded-[10px] px-3.5 py-3 text-sm text-gray-800 focus:bg-white focus:border-[#F24E05] outline-none transition cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="foodDesc"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Description
                </label>
                <textarea
                  id="foodDesc"
                  placeholder="Describe your delicious food item..."
                  rows="3"
                  className="w-full bg-gray-100 border border-transparent rounded-[10px] px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] outline-none transition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="foodImg"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="foodImg"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-100 border border-transparent rounded-[10px] px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#F24E05] outline-none transition"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {adding ? (
                  "Listing Food..."
                ) : (
                  <>
                    <Plus size={16} /> Publish Food Listing
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Vendor's active listings */}
          <div
            id="inventory"
            className="rounded-3xl bg-white p-8 shadow-sm border border-black/[0.03]"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Layers className="text-[#F24E05]" size={22} />
              <h2 className="text-2xl font-bold text-gray-900">
                Your Menu Items ({vendorItems.length})
              </h2>
            </div>

            {vendorItems.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500">
                You haven't listed any custom dishes yet.
              </div>
            ) : (
              <div className="space-y-4">
                {vendorItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 truncate capitalize">
                        {item.category}
                      </p>
                      <p className="font-extrabold text-sm text-[#F24E05] mt-0.5">
                        ₦{item.price.toFixed(2)}
                      </p>
                    </div>
                    {/* Availability toggle button */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleMenuItemAvailability(item.id, item.is_available)
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        item.is_available !== false
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {item.is_available !== false
                        ? "Available"
                        : "Unavailable"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
