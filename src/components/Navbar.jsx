import React, { useState } from "react";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/AppContext";

function Navbar() {
  const firebase = useFirebase() || {};
  // 1. Context se 'cart' bhi nikala
  const { user, loggedOut, cart } = firebase; 

  const [flag, setFlag] = useState(false);      // Cart popup
  const [userFlag, setUserFlag] = useState(false); // User dropdown
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const hasStore = !!user?.storeAdmin;

  // 2. Total items calculate karne ka logic
  // (Agar aapke cart object me 'quantity' field hai to ye sum karega, nahi to length lega)
  const totalItems = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const createShop = () => {
    if (hasStore) {
      navigate("/manageStore");
    } else {
      navigate("/AddYourShop");
    }
  };

  const closePopup = () => {
    setFlag(false);
  };

  const handleLogout = () => {
    if (loggedOut) {
      loggedOut();
    }
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  return (
    <header className="text-gray-600 body-font fixed z-20 top-0 left-0 right-0 w-full bg-white shadow-sm">
      <div className="container mx-auto flex flex-wrap py-4 px-4 flex-row items-center justify-between w-full md:w-[94%]">
        <a
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-0 md:mb-0"
        >
          <span className="text-xl font-serif font-extrabold title-font tracking-wider text-[#FF5F1F]">
            Bharat Khazana
          </span>
        </a>

        <nav className="md:ml-auto flex flex-row items-center rounded-lg text-base justify-center">
          
          {/* Our Vision */}
          <div className="hidden md:flex flex-row items-center justify-center bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition cursor-pointer">
            <Link to="/vision" className="text-gray-700 hover:text-[#FF5F1F] text-sm font-medium flex items-center gap-1">
               👁️ Our Vision
            </Link>
          </div>

          {/* Add / Manage Store */}
          <div className="hidden md:flex flex-row items-center justify-center bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition">
            <button onClick={createShop} className="text-gray-700 hover:text-[#FF5F1F] text-sm font-medium flex items-center gap-1">
              🏪 {hasStore ? "Manage Store" : "Add your store"}
            </button>
          </div>

          {/* User Menu */}
          <div
            onMouseLeave={() => setUserFlag(false)}
            onMouseEnter={() => setUserFlag(true)}
            className="relative hidden md:flex flex-row items-center justify-center bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>

            <button
              className="text-gray-700 hover:text-[#FF5F1F] ml-2 text-sm font-medium"
              onClick={handleUserClick}
            >
              {isLoggedIn ? user?.name?.split(' ')[0] : "Sign in"}
            </button>

            {/* Dropdown */}
            {userFlag && (
              <div className="absolute top-8 right-0 bg-white border border-gray-100 shadow-xl rounded-lg flex flex-col p-2 w-48 z-50">
                <p
                  className="cursor-pointer md:hidden py-2 px-2 hover:bg-gray-50 rounded"
                  onClick={() => setFlag(true)}
                >
                  Cart ({totalItems})
                </p>

                {isLoggedIn && (
                  <>
                    <Link to="/orderHistory">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded text-gray-700">My Orders</p>
                    </Link>
                    <p
                      className="cursor-pointer md:hidden py-2 px-2 hover:bg-gray-50 rounded text-gray-700"
                      onClick={createShop}
                    >
                      {hasStore ? "Manage Store" : "Add your store"}
                    </p>
                    <p className="cursor-pointer py-2 px-2 hover:bg-red-50 text-red-500 rounded" onClick={handleLogout}>
                      Logout
                    </p>
                  </>
                )}

                {!isLoggedIn && (
                  <>
                    <Link to="/signup">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">Register</p>
                    </Link>
                    <Link to="/login">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">Login</p>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ✅ Cart Button (Badge Added) */}
        <button
          onClick={() => setFlag(true)}
          className="hidden md:inline-flex relative items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-100 rounded text-base mt-4 md:mt-0 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#374151" // Gray-700
            className="w-6 h-6"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>

          {/* 🔴 RED BADGE LOGIC */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {flag && <Cart onClose={closePopup} />}
    </header>
  );
}

export default Navbar;