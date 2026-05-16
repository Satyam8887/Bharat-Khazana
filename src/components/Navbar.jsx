import React, { useState } from "react";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use AuthContext

function Navbar() {
  const { currentUser, logout } = useAuth(); // ✅ from AuthContext

  const [flag, setFlag] = useState(false);      // Cart popup
  const [userFlag, setUserFlag] = useState(false); // User dropdown
  const navigate = useNavigate();

  const isLoggedIn = !!currentUser;
  const hasStore = !!currentUser?.storeAdmin;

  // 👉 If you later connect cart with AuthContext, update here
  const totalItems = 0; // temporary (no cart in AuthContext yet)

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
    logout();
    navigate("/");
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  return (
    <header className="text-gray-600 body-font fixed z-20 top-0 left-0 right-0 w-full bg-white shadow-sm">
      <div className="container mx-auto flex flex-wrap py-4 px-4 flex-row items-center justify-between w-full md:w-[94%]">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 mb-0 md:mb-0"
        >
          <span className="text-xl font-serif font-extrabold tracking-wider text-[#FF5F1F]">
            Bharat Khazana
          </span>
        </Link>

        {/* Nav */}
        <nav className="md:ml-auto flex flex-row items-center rounded-lg text-base justify-center">
          
          {/* Home */}
          <div className="hidden md:flex bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]">
              🏠 Home
            </Link>
          </div>

          {/* Store */}
          <div className="hidden md:flex bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition">
            <button onClick={createShop} className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]">
              🏪 {hasStore ? "Manage Store" : "Add your store"}
            </button>
          </div>

          {/* 🔥 Admin Button */}
          {currentUser?.role === "admin" && (
            <div className="hidden md:flex bg-blue-100 py-1 px-3 rounded-full mr-4 hover:bg-blue-200 transition">
              <Link to="/admin" className="text-sm font-medium text-blue-700">
                ⚙️ Admin Panel
              </Link>
            </div>
          )}

          {/* User */}
          <div
            onMouseLeave={() => setUserFlag(false)}
            onMouseEnter={() => setUserFlag(true)}
            className="relative hidden md:flex bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition cursor-pointer"
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]"
              onClick={handleUserClick}
            >
              {isLoggedIn ? currentUser?.name?.split(" ")[0] : "Sign in"}
            </button>

            {/* Dropdown */}
            {userFlag && (
              <div className="absolute top-8 right-0 bg-white border shadow-lg rounded-lg flex flex-col p-2 w-48 z-50">
                
                {isLoggedIn && (
                  <>
                    <Link to="/orderHistory">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">My Orders</p>
                    </Link>

                    <p
                      className="py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={createShop}
                    >
                      {hasStore ? "Manage Store" : "Add your store"}
                    </p>

                    <p
                      className="py-2 px-2 hover:bg-red-50 text-red-500 rounded cursor-pointer"
                      onClick={handleLogout}
                    >
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

        {/* Cart Button (basic) */}
        <button
          onClick={() => setFlag(true)}
          className="hidden md:inline-flex relative items-center px-3 py-1 hover:bg-gray-100 rounded transition"
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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