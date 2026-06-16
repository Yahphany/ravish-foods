import React, { createContext, useState } from "react";
import nigerianFoods from "../component/data/african_menu";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(nigerianFoods);

  return (
    <MenuContext.Provider value={{ menuItems }}>
      {children}
    </MenuContext.Provider>
  );
};
