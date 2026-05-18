import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFormInput from "../hooks/useFormInput";
import validateEmail from "../helper/emailRegex";
import { LoginApi } from "../api/authHelper";
import { useFirebase } from "../context/AppContext";
import Spinner from "./Spinner";

const Login = () => {
  const { user } = useFirebase();
  const currentUser = Array.isArray(user) ? user[0] : user;

  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const emailInput = useFormInput("");
  const passwordInput = useFormInput("");

  const validateDetails = () => {
    const errors = {};
    setResError("");

    if (!validateEmail(emailInput.value)) {
      errors.email = "Invalid Email";
      emailInput.setError("Invalid Email");
    } else {
      emailInput.setError("");
    }

    if (passwordInput.value.length === 0) {
      errors.password = "Password is required.";
      passwordInput.setError("Password is required.");
    } else {
      passwordInput.setError("");
    }

    return errors;
  };

  const extractFirebaseMessage = (error) => {
    if (error?.message) {
      const match = error.message.match(/\(([^)]+)\)/);

      if (match && match[1]) {
        return match[1]
          .replace("auth/", "")
          .replace(/-/g, " ");
      }
    }

    return "Something went wrong";
  };

  const loginUser = async () => {
    if (loading) return;

    const error = validateDetails();

    if (Object.keys(error).length !== 0) return;

    try {
      setLoading(true);
      setResError("");

      const res = await LoginApi(
        emailInput.value.trim(),
        passwordInput.value.trim()
      );

      console.log("✅ Login success:", res.user.email);

      navigate("/");

    } catch (error) {
      console.log("❌ Login error:", error);

      const msg = extractFirebaseMessage(error);

      setResError(msg);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id || currentUser?.userId) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const guestLogin = async () => {
    if (loading) return;

    setResError("");

    try {
      setLoading(true);

      const guestEmail = "guestuser@gmail.com";
      const guestPassword = "123456789";

      await LoginApi(guestEmail, guestPassword);

      navigate("/");

    } catch (error) {
      const msg = extractFirebaseMessage(error);

      setResError(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center mt-10 px-4"
      style={{ background: "#FEF3C7" }}
    >
      <div
        className="w-full rounded-2xl md:max-w-md overflow-hidden"
        style={{
          background: "#FFF8F0",
          border: "1px solid #F5C89A",
          boxShadow: "0 10px 30px rgba(180,83,9,0.10)",
        }}
      >

        {/* Header Section */}
        <div className="p-6 sm:p-8">

          <div className="text-center mb-6">

            <h1
              className="text-2xl font-bold tracking-wide font-serif"
              style={{ color: "#7C2D12" }}
            >
              Welcome Back
            </h1>

            <p
              className="text-sm mt-2"
              style={{ color: "#92400E" }}
            >
              Sign in to continue to Bharat Khazana
            </p>

          </div>

          <div className="space-y-5">

            {/* Email Field */}
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Your Email
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#92400E"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>

                <input
                  type="email"
                  className="sm:text-sm rounded-lg block w-full pl-10 p-2.5 transition-colors"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                  placeholder="name@company.com"
                  required
                  value={emailInput.value}
                  onChange={emailInput.onChange}
                />
              </div>

              {emailInput.error && (
                <p className="text-red-500 text-xs mt-1">
                  {emailInput.error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#92400E"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 00-6 0v2h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="sm:text-sm rounded-lg block w-full pl-10 pr-10 p-2.5 transition-colors"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                  placeholder="••••••••"
                  required
                  value={passwordInput.value}
                  onChange={passwordInput.onChange}
                />

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  style={{ color: "#92400E" }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>

              </div>

              {passwordInput.error && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordInput.error}
                </p>
              )}
            </div>

            {/* Main Login Button */}
            <button
              onClick={loginUser}
              className="w-full text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none font-bold rounded-lg text-sm px-5 py-3 text-center"
              style={{
                background:
                  "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              }}
            >
              {loading ? <Spinner /> : "Sign in"}
            </button>

            {/* Separator */}
            <div className="flex items-center my-4">
              <div
                className="flex-grow h-px"
                style={{ background: "#F5C89A" }}
              ></div>

              <span
                className="flex-shrink-0 px-4 text-xs font-medium uppercase"
                style={{ color: "#92400E" }}
              >
                Or
              </span>

              <div
                className="flex-grow h-px"
                style={{ background: "#F5C89A" }}
              ></div>
            </div>

            {/* Error Message */}
            {resError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm text-center">
                {resError}
              </div>
            )}

            {/* Create Account Link */}
            <p
              className="text-sm font-light text-center"
              style={{ color: "#92400E" }}
            >
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold hover:underline"
                style={{ color: "#B45309" }}
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;