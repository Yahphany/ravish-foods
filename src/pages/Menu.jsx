import React, { useMemo, useState, useContext } from "react";
import Foodcard from "../component/Foodcard";
import { MenuContext } from "../context/MenuContext";
import Layout from "../component/Layout";
import { CartContext } from "../context/CartContext";

export default function Menu() {
  const { addToCart } = useContext(CartContext);
  const { menuItems } = useContext(MenuContext);

  const categories = [
    "All",
    "Rice Dishes",
    "Soups & Stews",
    "Swallow",
    "Snacks & Pastries",
    "Grills & Proteins",
    "Porridges & Legumes",
    "Sides & Breakfast",
    "Beverages",
  ];
  
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const sortedMenu = useMemo(
    () => [...menuItems].sort((a, b) => a.id - b.id),
    [menuItems]
  );

  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? sortedMenu
        : sortedMenu.filter((item) => item.category === activeCategory),
    [activeCategory, sortedMenu]
  );

  return (
    <Layout>
      <div className="py-24 min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 bg-[#FDF5ED]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-bold text-4xl text-gray-900 tracking-tight">Our Menu</h1>
            <p className="text-gray-600 mt-2 text-md">Choose from our delicious selection of authentic dishes</p>
          </div>
          
          {/* Category Badges Filter Bar */}
          <div className="h-fit w-full bg-white shadow-sm border border-gray-100 flex flex-wrap justify-center gap-2 rounded-2xl md:rounded-full mb-10 p-2">
            {categories.map((category, index) => (
              <button
                key={index}
                type="button"
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-[#F24E05] text-white shadow-md shadow-orange-500/20 scale-[1.03]"
                    : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="w-full">
            <Foodcard items={filteredItems} onAddToCart={addToCart} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
