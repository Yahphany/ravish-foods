import React, { createContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [dbMenuItems, setDbMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all vendor-added menu items from the Supabase database
  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase.from("menu_items").select("*");

      if (error) {
        console.error("Error fetching database menu items:", error);
      } else if (data) {
        setDbMenuItems(data);
      }
    } catch (err) {
      console.error("Exception fetching menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch once on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // addMenuItem: Inserts a new vendor food listing into Supabase
  const addMenuItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: item.name,
          price: parseFloat(item.price),
          image: item.image || "",
          category: item.category,
          description: item.description || "",
          vendor_id: item.vendor_id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting menu item:", error);
        return { success: false, error };
      }

      // Re-fetch database items to trigger UI updates for buyers
      await fetchMenuItems();
      return { success: true, data };
    } catch (err) {
      console.error("Exception adding menu item:", err);
      return { success: false, error: err };
    }
  };

  // toggleMenuItemAvailability: Updates the active/inactive state of a vendor's food item
  const toggleMenuItemAvailability = async (itemId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: !currentStatus })
        .eq("id", itemId);

      if (error) {
        console.error("Error toggling item availability:", error);
        return { success: false, error };
      }

      // Re-fetch to update menus for both vendors and buyers
      await fetchMenuItems();
      return { success: true };
    } catch (err) {
      console.error("Exception toggling item availability:", err);
      return { success: false, error: err };
    }
  };

  // Only display database items listed by vendor accounts that are marked as available
  const menuItems = dbMenuItems.filter((item) => item.is_available !== false);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        dbMenuItems,
        loading,
        addMenuItem,
        fetchMenuItems,
        toggleMenuItemAvailability,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
