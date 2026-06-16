import React, { createContext, useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";

// Create the Cart context — consumers import CartContext to access cart & order state
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Pull the current authenticated session and user role from the global auth context
  const { session, userRole } = UserAuth();

  // Cart state: initialised from localStorage so items persist across page refreshes
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem("ravish_cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  // Orders fetched from the Supabase database
  const [orders, setOrders] = useState([]);
  // Controls the loading spinner on dashboards while orders are being fetched
  const [ordersLoading, setOrdersLoading] = useState(false);

  // fetchOrders: queries the Supabase 'orders' table. The query filters change
  // depending on whether the user is a Buyer, Vendor, or Logistics dispatcher.
  const fetchOrders = async () => {
    // Guard: if no user session is loaded, exit early
    if (!session?.user?.id) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      // Setup the base query selecting order information joined with customer profiles and order items
      let query = supabase
        .from("orders")
        .select(`
          id,
          status,
          total,
          delivery_fee,
          delivery_address,
          created_at,
          user_id,
          vendor_id,
          dispatcher_id,
          profiles:user_id (
            display_name,
            email,
            phone
          ),
          order_items (
            id,
            menu_item_id,
            name,
            price,
            quantity,
            image
          )
        `);

      // Enforce role-based data partitioning:
      if (userRole === "buyer") {
        // Buyers can only see their own orders
        query = query.eq("user_id", session.user.id);
      } else if (userRole === "vendor") {
        // Vendors can only see orders placed for their menu items
        query = query.eq("vendor_id", session.user.id);
      } else if (userRole === "logistics") {
        // Logistics dispatchers can see unclaimed orders ready for delivery,
        // or any orders they have already claimed for delivery
        query = query.or(`dispatcher_id.eq.${session.user.id},and(status.eq.Ready for Delivery,dispatcher_id.is.null)`);
      } else {
        // Fallback for safety during loading / role-resolving
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else if (data) {
        // Normalise the nested Supabase responses into the structure expected by dashboards
        const formatted = data.map((order) => ({
          id: order.id,
          date: order.created_at,
          items: (order.order_items || []).map((item) => ({
            id: item.menu_item_id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            image: item.image,
          })),
          total: parseFloat(order.total),
          status: order.status,
          deliveryAddress: order.delivery_address,
          deliveryFee: parseFloat(order.delivery_fee),
          userId: order.user_id,
          vendorId: order.vendor_id,
          dispatcherId: order.dispatcher_id,
          customer: order.profiles ? {
            displayName: order.profiles.display_name,
            email: order.profiles.email,
            phone: order.profiles.phone
          } : null
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.error("Exception fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Re-fetch orders from the database whenever the user session or role changes
  useEffect(() => {
    fetchOrders();
  }, [session, userRole]);

  // Sync the cart to localStorage whenever it changes so items survive page refreshes
  useEffect(() => {
    localStorage.setItem("ravish_cart", JSON.stringify(cart));
  }, [cart]);

  // addToCart: Adds an item to the shopping cart.
  // If the item already exists in the cart, increment its quantity by 1.
  // Otherwise, add the item as a new entry with an initial quantity of 1.
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // removeFromCart: Removes a specific item from the shopping cart using its ID.
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // updateQuantity: Updates the quantity of a specific item in the cart.
  // Math.max(1, quantity) ensures the quantity never falls below 1.
  const updateQuantity = (itemId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // clearCart: Resets the cart back to an empty array (typically used after checkout).
  const clearCart = () => {
    setCart([]);
  };

  // placeOrder: Groups checkout items by vendor and places separate orders in Supabase.
  // This allows multiple vendors to accept and process their orders independently.
  const placeOrder = async (deliveryAddress = "Default Address") => {
    if (cart.length === 0 || !session?.user?.id) return null;
    try {
      // Group items in the shopping cart by vendor_id
      const vendorGroups = {};
      cart.forEach((item) => {
        const vendorId = item.vendor_id || "platform"; // Use a fallback key if vendor_id is not specified
        if (!vendorGroups[vendorId]) {
          vendorGroups[vendorId] = [];
        }
        vendorGroups[vendorId].push(item);
      });

      const orderResults = [];

      // Process orders for each vendor grouping
      for (const [vendorKey, items] of Object.entries(vendorGroups)) {
        const actualVendorId = vendorKey === "platform" ? null : vendorKey;
        const groupTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 1. Insert the order record for this group
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: session.user.id,
            vendor_id: actualVendorId,
            total: groupTotal,
            delivery_fee: 500, // Standard delivery fee per order
            delivery_address: deliveryAddress,
            status: "Pending",
          })
          .select()
          .single();

        if (orderError) {
          console.error("Error inserting order group:", orderError);
          throw orderError;
        }

        // 2. Map group items to the database order_items table schema
        const itemsToInsert = items.map((item) => ({
          order_id: orderData.id,
          menu_item_id: item.id.toString(), // Coerce ID to string to support both numeric fallbacks and UUIDs
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          vendor_id: actualVendorId,
        }));

        // 3. Insert all order items for this group
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error inserting order items group:", itemsError);
          throw itemsError;
        }

        orderResults.push({
          id: orderData.id,
          date: orderData.created_at,
          items: [...items],
          total: groupTotal,
          status: "Pending",
        });
      }

      // Clear the local shopping cart and update database state
      clearCart();
      await fetchOrders();

      // Return the first created order representation (or summary details)
      return orderResults[0];
    } catch (err) {
      console.error("Exception placing order:", err);
      return null;
    }
  };

  // updateOrderStatus: Updates the state of an existing order (e.g. Preparing, Ready for Delivery, Completed).
  // Typically triggered by Vendors and Logistics dispatchers from their respective portals.
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        return false;
      }

      // Fetch the updated orders list from the database to synchronize across open contexts
      await fetchOrders();
      return true;
    } catch (err) {
      console.error("Exception updating order status:", err);
      return false;
    }
  };

  // claimOrderForDelivery: Assigns a logistics dispatcher account to an order,
  // transitioning its status to 'Out for Delivery'. The order becomes unavailable to other drivers.
  const claimOrderForDelivery = async (orderId, dispatcherId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          dispatcher_id: dispatcherId,
          status: "Out for Delivery",
        })
        .eq("id", orderId);

      if (error) {
        console.error("Error claiming order for delivery:", error);
        return false;
      }

      // Re-fetch orders to synchronise the dashboards
      await fetchOrders();
      return true;
    } catch (err) {
      console.error("Exception claiming order for delivery:", err);
      return false;
    }
  };

  // cancelOrder: Updates the status of an existing order to 'Cancelled' in Supabase.
  const cancelOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);

      if (error) {
        console.error("Error cancelling order:", error);
        return false;
      }

      await fetchOrders();
      return true;
    } catch (err) {
      console.error("Exception cancelling order:", err);
      return false;
    }
  };

  // reorder: Takes a previous order and pushes all of its items back into the active cart.
  const reorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item);
    });
  };

  // getCartCount: Calculates the total quantity of items currently in the cart.
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // getCartTotal: Calculates the total cost of all items currently in the cart.
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        ordersLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        cancelOrder,
        reorder,
        getCartCount,
        getCartTotal,
        fetchOrders,
        updateOrderStatus,
        claimOrderForDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
