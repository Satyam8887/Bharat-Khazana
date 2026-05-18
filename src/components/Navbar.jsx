import React, { useState } from "react";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFirebase } from "../context/AppContext";

import {
  FaHome,
  FaStore,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cart } = useFirebase();

  const [flag, setFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!currentUser;
  const hasStore = !!currentUser?.storeAdmin;

  const totalItems = cart?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const createShop = () => {
    setMenuOpen(false);

    if (hasStore) navigate("/manageStore");
    else navigate("/AddYourShop");
  };

  const closePopup = () => setFlag(false);

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
    <header
      className="fixed z-20 top-0 left-0 right-0 w-full shadow-md"
      style={{
        background: "#fff",
        borderBottom: "2px solid #F5C89A",
      }}
    >
      <div className="w-full flex items-center justify-between py-3 px-4 md:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-serif font-extrabold tracking-wider"
            style={{
              background:
                "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bharat Khazana
          </span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center gap-3 text-base">

          {/* Home */}
          <Link
            to="/"
            className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
            style={{
              color: "#7C2D12",
              background: "#FEF3C7",
            }}
          >
            <span className="flex items-center gap-2">
              <FaHome />
              Home
            </span>
          </Link>

          {/* Store */}
          <button
            onClick={createShop}
            className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
            style={{
              color: "#7C2D12",
              background: "#FFF8F0",
            }}
          >
            <span className="flex items-center gap-2">
              <FaStore />
              {hasStore ? "Manage Store" : "Add your store"}
            </span>
          </button>

          {/* Admin */}
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
              style={{
                color: "#B45309",
                background: "#FEF3C7",
                border: "1px solid #F5C89A",
              }}
            >
              <span className="flex items-center gap-2">
                <FaCog />
                Admin Panel
              </span>
            </Link>
          )}

          {/* User Dropdown */}
          <div
            onMouseEnter={() => setUserFlag(true)}
            onMouseLeave={() => setUserFlag(false)}
            className="relative"
          >
            <button
              className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-white"
              style={{
                background: isLoggedIn
                  ? "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)"
                  : "#B45309",
              }}
              onClick={handleUserClick}
            >
              <FaUser />
              {isLoggedIn
                ? currentUser?.name?.split(" ")[0]
                : "Sign in"}
            </button>

            {/* Dropdown */}
            {userFlag && (
              <div
                className="absolute top-12 right-0 flex flex-col p-2 w-52 z-50 rounded-2xl"
                style={{
                  background: "#fff",
                  border: "1px solid #F5C89A",
                  boxShadow:
                    "0 8px 24px rgba(180,83,9,0.12)",
                }}
              >
                {isLoggedIn ? (
                  <>
                    <Link to="/orders">
                      <p
                        className="py-3 px-3 rounded-xl text-sm transition-all duration-200 cursor-pointer flex items-center gap-2"
                        style={{ color: "#7C2D12" }}
                      >
                        <FaBoxOpen />
                        My Orders
                      </p>
                    </Link>

                    <p
                      className="py-3 px-3 rounded-xl text-sm cursor-pointer transition-all duration-200 flex items-center gap-2"
                      style={{ color: "#7C2D12" }}
                      onClick={createShop}
                    >
                      <FaStore />
                      {hasStore
                        ? "Manage Store"
                        : "Add your store"}
                    </p>

                    <hr
                      style={{
                        borderColor: "#F5C89A",
                        margin: "4px 0",
                      }}
                    />

                    <p
                      className="py-3 px-3 rounded-xl text-sm cursor-pointer transition-all duration-200 flex items-center gap-2"
                      style={{ color: "#DC2626" }}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      Logout
                    </p>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <p
                        className="py-3 px-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                        style={{ color: "#7C2D12" }}
                      >
                        Register
                      </p>
                    </Link>

                    <Link to="/login">
                      <p
                        className="py-3 px-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                        style={{
                          color: "#B45309",
                          fontWeight: 500,
                        }}
                      >
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
            className="relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
            style={{
              color: "#B45309",
              background: "#FEF3C7",
              border: "1px solid #F5C89A",
            }}
          >
            <FaShoppingCart />
            Cart

            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-md"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          className="md:hidden text-2xl"
          style={{ color: "#B45309" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-3"
          style={{
            background: "#fff",
            borderTop: "1px solid #F5C89A",
          }}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium px-4 py-3 rounded-full"
            style={{
              color: "#7C2D12",
              background: "#FEF3C7",
            }}
          >
            <span className="flex items-center gap-2">
              <FaHome />
              Home
            </span>
          </Link>

          <button
            onClick={createShop}
            className="text-left text-sm font-medium px-4 py-3 rounded-full"
            style={{
              color: "#7C2D12",
              background: "#FFF8F0",
            }}
          >
            <span className="flex items-center gap-2">
              <FaStore />
              {hasStore ? "Manage Store" : "Add your store"}
            </span>
          </button>

          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium px-4 py-3 rounded-full"
              style={{
                color: "#B45309",
                background: "#FEF3C7",
              }}
            >
              <span className="flex items-center gap-2">
                <FaCog />
                Admin Panel
              </span>
            </Link>
          )}

          <button
            onClick={() => {
              setFlag(true);
              setMenuOpen(false);
            }}
            className="relative text-left text-sm font-medium px-4 py-3 rounded-full"
            style={{
              color: "#B45309",
              background: "#FEF3C7",
            }}
          >
            <span className="flex items-center gap-2">
              <FaShoppingCart />
              Cart
            </span>

            {totalItems > 0 && (
              <span
                className="absolute top-2 right-3 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-full"
                style={{
                  color: "#7C2D12",
                  background: "#FFF8F0",
                }}
              >
                <span className="flex items-center gap-2">
                  <FaBoxOpen />
                  My Orders
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-sm font-medium px-4 py-3 rounded-full"
                style={{
                  color: "#DC2626",
                  background: "#FEE2E2",
                }}
              >
                <span className="flex items-center gap-2">
                  <FaSignOutAlt />
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-full text-center text-white"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-full text-center"
                style={{
                  color: "#B45309",
                  background: "#FEF3C7",
                }}
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