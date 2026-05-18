import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/AppContext";
import cartImage from "../assets/emptyCart.gif";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";

function Cart({ onClose }) {
  const {
    cart,
    incrementProductQuantity,
    decrementProductQuantity,
    removeProduct,
    user,
  } = useFirebase();

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const calculateTotal = () => {
    let cal = 0;
    cart.forEach((element) => {
      cal = cal + element.price * element.quantity;
    });
    setTotal(cal);
  };

  const decrement = (prod) => {
    if (prod.quantity === 1) {
      removeFromCart(prod.id);
    } else {
      decrementProductQuantity(prod.id);
    }
  };

  const removeFromCart = (id) => {
    removeProduct(id);
    toast.success("Removed Successfully!", {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  const handleCheckout = () => {
    if (cart.length !== 0) {
      if (!user?.userId) {
        toast.warn("Please login to complete the purchase", {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        navigate("/checkout", {
          state: { cartItems: cart, total },
        });
        onClose();
      }
    }
  };

  return (
    <div
      className="relative z-50"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Cart Panel */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-[#FEF3C7] shadow-2xl">

                {/* Header */}
                <div
                  className="px-6 py-5 text-white"
                  style={{ background: "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaShoppingCart className="text-2xl" />
                      <h2 className="text-2xl font-bold font-serif" id="slide-over-title">
                        Shopping Cart
                      </h2>

                      {cart.length > 0 && (
                        <span
                          style={{
                            background: "rgba(255,255,255,0.25)",
                            border: "1px solid rgba(255,255,255,0.4)",
                            borderRadius: "20px",
                            padding: "2px 10px",
                            fontSize: "13px",
                            fontWeight: "700",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {cart.length} item{cart.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={onClose}
                      type="button"
                      className="text-white hover:scale-110 transition-all duration-300"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6">

                  {/* Empty Cart */}
                  {cart && cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <img src={cartImage} alt="empty-cart" className="w-[80%]" />
                      <p className="mt-4 text-lg" style={{ color: "#92400E" }}>
                        Your cart is empty
                      </p>
                    </div>
                  )}

                  {/* Cart Items */}
                  {cart && cart.length !== 0 && cart.map((data) => (
                    <div
                      key={data?.id}
                      className="flex bg-white rounded-3xl shadow-md p-4 mb-5 hover:shadow-xl transition-all duration-300"
                      style={{ border: "1px solid #F5C89A" }}
                    >
                      {/* Product Image */}
                      <div
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl"
                        style={{
                          background: "linear-gradient(135deg, #FEF3C7, #FFF8F0)",
                          border: "1px solid #F5C89A",
                        }}
                      >
                        <img
                          src={data?.imageUrl}
                          alt={data?.title}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="ml-4 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <h3
                              className="text-base font-bold line-clamp-2"
                              style={{
                                color: "#7C2D12",
                                fontFamily: "Georgia, serif",
                              }}
                            >
                              {data?.title}
                            </h3>

                            <p
                              className="text-base font-bold whitespace-nowrap"
                              style={{
                                color: "#B45309",
                                fontFamily: "Georgia, serif",
                              }}
                            >
                              ₹{data?.price}
                            </p>
                          </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex items-center justify-between mt-4">

                          {/* Quantity Controls */}
                          <div
                            className="flex items-center rounded-full overflow-hidden"
                            style={{ border: "1.5px solid #F5C89A" }}
                          >
                            <button
                              onClick={() => decrement(data)}
                              className="px-3 py-2 bg-gray-50 hover:text-white transition-all duration-300"
                              style={{
                                background: "#FFF8F0",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#B45309";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#FFF8F0";
                              }}
                            >
                              <FaMinus size={12} />
                            </button>

                            <div
                              className="px-4 text-sm font-bold"
                              style={{ color: "#7C2D12" }}
                            >
                              {data?.quantity}
                            </div>

                            <button
                              onClick={() => incrementProductQuantity(data?.id)}
                              className="px-3 py-2 bg-gray-50 hover:text-white transition-all duration-300"
                              style={{
                                background: "#FFF8F0",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#B45309";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#FFF8F0";
                              }}
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(data.id)}
                            className="text-red-400 hover:text-red-600 transition-all duration-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div
                    className="px-6 py-5"
                    style={{
                      borderTop: "1px solid #F5C89A",
                      background: "white",
                      boxShadow: "0 -4px 20px rgba(180,83,9,0.07)",
                    }}
                  >
                    {/* Pricing */}
                    <div className="space-y-3">
                      <div
                        className="flex justify-between"
                        style={{
                          color: "#92400E",
                          fontFamily: "sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <p>Subtotal</p>
                        <p className="font-semibold">₹{total}</p>
                      </div>

                      <div
                        className="flex justify-between"
                        style={{
                          color: "#92400E",
                          fontFamily: "sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <p>Shipping</p>
                        <p className="font-semibold text-green-600">FREE</p>
                      </div>

                      <div
                        className="flex justify-between text-lg font-bold pt-3"
                        style={{
                          borderTop: "1px solid #F5C89A",
                          color: "#7C2D12",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        <p>Total</p>
                        <p>₹{total}</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="mt-6 w-full py-3 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;