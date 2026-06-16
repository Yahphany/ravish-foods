import React, { useContext, useState, useEffect } from "react";
import Layout from "../component/Layout";
import { CartContext } from "../context/CartContext";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  ShoppingBag, 
  Minus, 
  Plus, 
  ArrowLeft,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Cart() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    placeOrder 
  } = useContext(CartContext);
  
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  useEffect(() => {
    // Inject Paystack script dynamically
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 500 : 0; // Flat delivery fee of 500 Naira
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (itemId, currentQty, amount) => {
    updateQuantity(itemId, currentQty + amount);
  };

  const handleCheckout = async () => {
    if (!session) {
      setErrorMsg("Please sign in to place your order.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      setErrorMsg("Paystack Public Key is missing in environment variables.");
      setLoading(false);
      return;
    }

    if (!window.PaystackPop) {
      setErrorMsg("Payment gateway is loading, please try again in a moment.");
      setLoading(false);
      return;
    }

    const handleSuccessfulPayment = async (response) => {
      try {
        const order = await placeOrder("Default Address");
        if (order) {
          setSuccessMsg("Payment successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setErrorModalMessage("Payment was successful, but we failed to record your order. Please contact support.");
          setShowErrorModal(true);
          setLoading(false);
        }
      } catch (orderErr) {
        console.error("Error writing order after payment:", orderErr);
        setErrorModalMessage("Payment succeeded, but an error occurred saving the order details.");
        setShowErrorModal(true);
        setLoading(false);
      }
    };

    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: session.user.email,
        amount: Math.round(total * 100), // Paystack expects amount in Kobo
        currency: "NGN",
        ref: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        callback: function (response) {
          handleSuccessfulPayment(response);
        },
        onClose: function () {
          // Payment window closed/cancelled
          setErrorModalMessage("Payment wasn't successful. The transaction was cancelled.");
          setShowErrorModal(true);
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Error opening Paystack iframe:", err);
      setErrorMsg("Failed to open Paystack payment gateway. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-24 min-h-screen bg-[#FDF5ED] px-4 sm:px-6 md:px-10 lg:px-20 text-gray-800">
        <div className="max-w-5xl mx-auto">
          
          <button 
            onClick={() => navigate("/menu")} 
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#F24E05] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Your Cart</h1>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-sm animate-pulse">
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center border border-black/[0.02] shadow-sm flex flex-col items-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
              <p className="text-sm text-gray-500 mt-2 mb-6 max-w-sm">
                Looks like you haven't added anything to your cart yet. Explore our delicious menu items to get started!
              </p>
              <button 
                onClick={() => navigate("/menu")}
                className="bg-[#F24E05] hover:bg-[#D94100] text-white px-8 py-3 rounded-full font-bold text-sm transition cursor-pointer shadow-md shadow-orange-500/10"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="rounded-3xl bg-white p-5 border border-black/[0.02] shadow-sm flex items-center gap-4 transition hover:shadow-md"
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-2xl object-cover border border-gray-100" 
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-900 text-base truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-semibold">{item.category}</p>
                      <p className="text-sm font-black text-[#F24E05] mt-2">₦{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full p-1.5">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-sm disabled:opacity-40 transition cursor-pointer border border-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-sm transition cursor-pointer border border-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-3xl bg-white p-6 border border-black/[0.02] shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold border-b border-gray-100 pb-3 text-gray-900">Order Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-800">₦{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5"><Truck size={16} /> Delivery Fee</span>
                      <span className="font-bold text-gray-800">₦{deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between text-base font-extrabold text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-lg text-[#F24E05] font-black">₦{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-[#F24E05] hover:bg-[#D94100] active:scale-[0.98] text-white rounded-full py-4 text-sm font-bold transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CreditCard size={18} /> Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Premium Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-black/[0.05] animate-scale-up space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle size={36} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Payment Failed</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {errorModalMessage}
              </p>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-full transition-all cursor-pointer text-sm shadow-md"
            >
              Go Back to Cart
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
