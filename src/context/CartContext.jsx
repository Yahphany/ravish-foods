import React, { createContext, useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { session } = UserAuth();
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem("ravish_cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = async () => {
    if (!session?.user?.id) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total,
          delivery_fee,
          delivery_address,
          created_at,
          order_items (
            id,
            menu_item_id,
            name,
            price,
            quantity,
            image
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else if (data) {
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
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.error("Exception fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  useEffect(() => {
    localStorage.setItem("ravish_cart", JSON.stringify(cart));
  }, [cart]);

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

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (deliveryAddress = "Default Address") => {
    if (cart.length === 0 || !session?.user?.id) return null;
    try {
      const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          total: orderTotal,
          delivery_fee: 500,
          delivery_address: deliveryAddress,
          status: "Pending"
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error inserting order:", orderError);
        return null;
      }

      const itemsToInsert = cart.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error inserting order items:", itemsError);
        return null;
      }

      clearCart();
      await fetchOrders();

      return {
        id: orderData.id,
        date: orderData.created_at,
        items: [...cart],
        total: orderTotal,
        status: "Pending",
      };
    } catch (err) {
      console.error("Exception placing order:", err);
      return null;
    }
  };

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

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      return true;
    } catch (err) {
      console.error("Exception cancelling order:", err);
      return false;
    }
  };

  const reorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item);
    });
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
