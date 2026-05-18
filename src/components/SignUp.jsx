import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/AppContext";
import Popup from "./Popup";
import VerifyOtp from "./VerifyOtp";
import { RegisterApi } from "../api/authHelper";
import { createNewUser } from "../api/firestoreApi";
import validateEmail from "../helper/emailRegex";
import validateMobile from "../helper/mobileReges";
import useFormInput from "../hooks/useFormInput";
import Spinner from "./Spinner";

function SignUp() {
  const { user } = useFirebase();
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const emailInput = useFormInput("");
  const nameInput = useFormInput("");
  const mobileInput = useFormInput("");
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

    if (!validateMobile(mobileInput.value)) {
      errors.mobile = "Invalid Mobile Number";
      mobileInput.setError("Invalid Mobile Number");
    } else {
      mobileInput.setError("");
    }

    if (nameInput.value.length <= 2) {
      errors.name = "Name must be valid";
      nameInput.setError("Name is too short");
    } else {
      nameInput.setError("");
    }

    if (passwordInput.value.length < 8) {
      errors.password = "Min 8 chars required";
      passwordInput.setError("Password must be at least 8 chars");
    } else {
      passwordInput.setError("");
    }

    return errors;
  };

  const addUser = async (uid) => {
    try {
      await createNewUser({
        name: nameInput.value,
        email: emailInput.value,
        mobile: mobileInput.value,
        userId: uid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resgisterUser = async () => {
    if (loading) return;

    const errors = validateDetails();

    if (Object.keys(errors).length !== 0) return;

    try {
      setLoading(true);
      setResError("");

      const res = await RegisterApi(
        emailInput.value,
        passwordInput.value
      );

      await addUser(res.user.uid);

      navigate("/");
      setLoading(false);

    } catch (error) {

      if (error.message) {

        const match = error.message.match(/\(([^)]+)\)/);

        if (match && match[1]) {
          setResError(
            match[1]
              .replace("auth/", "")
              .replace(/-/g, " ")
          );
        }
      }

      setLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.userId) {
      navigate("/");
    }
  }, [user, navigate]);

  const closePopup = () => {
    setFlag(false);
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center py-12 px-4 mt-10"
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

        {/* Header */}
        <div className="p-6 sm:p-8">

          <div className="text-center mb-6">

            <h1
              className="text-2xl font-bold tracking-wide font-serif"
              style={{ color: "#7C2D12" }}
            >
              Create Account
            </h1>

            <p
              className="text-sm mt-2"
              style={{ color: "#92400E" }}
            >
              Join Bharat Khazana today
            </p>

          </div>

          <div className="space-y-4">

            {/* Name Field */}
            <div>

              <label
                className="block mb-1 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Full Name
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
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>

                </div>

                <input
                  type="text"
                  className="sm:text-sm rounded-lg block w-full pl-10 p-2.5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                  placeholder="Your Name"
                  required
                  value={nameInput.value}
                  onChange={nameInput.onChange}
                />

              </div>

              {nameInput.error && (
                <p className="text-red-500 text-xs mt-1">
                  {nameInput.error}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>

              <label
                className="block mb-1 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Email Address
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
                  className="sm:text-sm rounded-lg block w-full pl-10 p-2.5"
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

            {/* Mobile Field */}
            <div>

              <label
                className="block mb-1 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                WhatsApp Number
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#92400E"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>

                </div>

                <input
                  type="tel"
                  className="sm:text-sm rounded-lg block w-full pl-10 p-2.5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  required
                  value={mobileInput.value}
                  onChange={mobileInput.onChange}
                />

              </div>

              {mobileInput.error && (
                <p className="text-red-500 text-xs mt-1">
                  {mobileInput.error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>

              <label
                className="block mb-1 text-sm font-medium"
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
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="sm:text-sm rounded-lg block w-full pl-10 pr-10 p-2.5"
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

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  style={{ color: "#92400E" }}
                >

                  {showPassword ? (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>

                  ) : (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
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

            {/* Submit Button */}
            <button
              onClick={resgisterUser}
              className="w-full text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none font-bold rounded-lg text-sm px-5 py-3 text-center"
              style={{
                background:
                  "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              }}
            >
              {loading ? <Spinner /> : "Create Account"}
            </button>

            {/* Error Message */}
            {resError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded relative text-sm text-center">
                {resError}
              </div>
            )}

            {/* Login Link */}
            <p
              className="text-sm font-light text-center"
              style={{ color: "#92400E" }}
            >
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "#B45309" }}
              >
                Login here
              </Link>

            </p>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      {flag && (
        <Popup onClose={closePopup}>
          <VerifyOtp />
        </Popup>
      )}

    </section>
  );
}

export default SignUp;