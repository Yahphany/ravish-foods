import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import { AuthContextProvider } from "../context/AuthContext";
import { MenuProvider } from "../context/MenuContext";
import { CartProvider } from "../context/CartContext";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Signup from "../pages/Signup";

export default function Approute() {
  return (
    <AuthContextProvider>
      <MenuProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </MenuProvider>
    </AuthContextProvider>
  );
}
