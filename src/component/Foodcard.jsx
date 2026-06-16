import React from "react";

export default function Foodcard({ items = [], onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full items-stretch">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-xl font-bold mb-2">{item.name}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Provided by {item.vendorName || "Admin Vendor"}
              </p>
              <p className="text-orange-600 text-md font-bold mt-2">
                ₦{item.price.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAddToCart?.(item)}
              className="bg-orange-500 w-full hover:bg-orange-600 text-white py-2 px-4 rounded-md mt-4 self-stretch"
            >
              + Add to Cart
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-600 py-20">
          No menu items found for this category.
        </div>
      )}
    </div>
  );
}
