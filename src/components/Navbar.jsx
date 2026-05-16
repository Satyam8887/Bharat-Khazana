import React, { useState } from "react";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();

  const [flag, setFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);

  // ✅ Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!currentUser;
  const hasStore = !!currentUser?.storeAdmin;

  const totalItems = 0;

  const createShop = () => {
    setMenuOpen(false);

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
    setMenuOpen(false);
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      setMenuOpen(false);
    }
  };

  return (
    <header className="text-gray-600 body-font fixed z-20 top-0 left-0 right-0 w-full bg-white shadow-sm">

      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:w-[94%]">

        {/* Logo */}
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900"
        >
          <span className="text-xl font-serif font-extrabold tracking-wider text-[#FF5F1F]">
            Bharat Khazana
          </span>
        </Link>

        {/* ================= DESKTOP NAVBAR ================= */}
        <nav className="hidden md:flex items-center text-base">

          {/* Home */}
          <div className="bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]"
            >
              🏠 Home
            </Link>
          </div>

          {/* Store */}
          <div className="bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition">
            <button
              onClick={createShop}
              className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]"
            >
              🏪 {hasStore ? "Manage Store" : "Add your store"}
            </button>
          </div>

          {/* Admin */}
          {currentUser?.role === "admin" && (
            <div className="bg-blue-100 py-1 px-3 rounded-full mr-4 hover:bg-blue-200 transition">
              <Link
                to="/admin"
                className="text-sm font-medium text-blue-700"
              >
                ⚙️ Admin Panel
              </Link>
            </div>
          )}

          {/* User */}
          <div
            onMouseLeave={() => setUserFlag(false)}
            onMouseEnter={() => setUserFlag(true)}
            className="relative bg-gray-100 py-1 px-3 rounded-full mr-4 hover:bg-gray-200 transition cursor-pointer"
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-[#FF5F1F]"
              onClick={handleUserClick}
            >
              {isLoggedIn
                ? currentUser?.name?.split(" ")[0]
                : "Sign in"}
            </button>

            {/* Dropdown */}
            {userFlag && (
              <div className="absolute top-8 right-0 bg-white border shadow-lg rounded-lg flex flex-col p-2 w-48 z-50">

                {isLoggedIn && (
                  <>
                    <Link to="/orders">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">
                        My Orders
                      </p>
                    </Link>

                    <p
                      className="py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={createShop}
                    >
                      {hasStore
                        ? "Manage Store"
                        : "Add your store"}
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
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">
                        Register
                      </p>
                    </Link>

                    <Link to="/login">
                      <p className="py-2 px-2 hover:bg-gray-50 rounded">
                        Login
                      </p>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => setFlag(true)}
            className="relative items-center px-3 py-1 hover:bg-gray-100 rounded transition"
          >
            🛒

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 flex flex-col gap-4">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 font-medium"
          >
            🏠 Home
          </Link>

          <button
            onClick={createShop}
            className="text-left text-gray-700 font-medium"
          >
            🏪 {hasStore ? "Manage Store" : "Add your store"}
          </button>

          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-blue-700 font-medium"
            >
              ⚙️ Admin Panel
            </Link>
          )}

          <button
            onClick={() => {
              setFlag(true);
              setMenuOpen(false);
            }}
            className="text-left text-gray-700 font-medium"
          >
            🛒 Cart
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium"
              >
                My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-red-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {flag && <Cart onClose={closePopup} />}
    </header>
  );
}

export default Navbar;