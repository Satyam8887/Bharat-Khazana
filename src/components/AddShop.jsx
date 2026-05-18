// AddShop.jsx
import React, { useEffect, useState } from "react";
import useFormInput from "../hooks/useFormInput";
import Spinner from "./Spinner";
import { uploadImage } from "../api/imageHelper";
import { createStore, updateShopAdminStatus } from "../api/firestoreApi";
import { useFirebase } from "../context/AppContext";
import useLocation from "../hooks/useLocation";
import { useNavigate } from "react-router-dom";

function AddShop() {
  const { user, loading: authLoading } = useFirebase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const { requestLocationPermission, latitude, longitude } = useLocation();

  const shopName = useFormInput("");
  const address = useFormInput("");
  const cityInput = useFormInput("");
  const imageInput = useFormInput("");
  const locationInput = useFormInput("");
  const whatsappInput = useFormInput("");

  const currentUser = Array.isArray(user) ? user[0] : user;

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) return null;

  // Pending approval screen
  if (submitted) {
    return (
      <section
        className="mt-20 mb-10 min-h-screen"
        style={{ background: "#FEF3C7" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto">

          <div
            className="w-full sm:max-w-md rounded-lg p-8 text-center"
            style={{
              background: "#FFF8F0",
              border: "1px solid #F5C89A",
              boxShadow: "0 8px 24px rgba(180,83,9,0.08)",
            }}
          >

            {/* Pending Icon */}
            <div
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full"
              style={{ background: "#FEF3C7" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#B45309"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#7C2D12" }}
            >
              Shop Submitted!
            </h2>

            <p
              className="mb-2"
              style={{ color: "#92400E" }}
            >
              Your shop{" "}
              <span
                className="font-semibold"
                style={{ color: "#B45309" }}
              >
                {shopName.value}
              </span>{" "}
              has been submitted successfully.
            </p>

            <p
              className="text-sm mb-6"
              style={{ color: "#92400E" }}
            >
              It is currently{" "}
              <span className="font-semibold text-yellow-700">
                pending approval
              </span>{" "}
              by our admin team.
              You'll be able to manage your store once it's approved.
              This usually takes 24–48 hours.
            </p>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => navigate("/manageStore")}
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                Go to My Store
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300"
                style={{
                  background: "#FEF3C7",
                  color: "#7C2D12",
                  border: "1px solid #F5C89A",
                }}
              >
                Back to Home
              </button>

            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleImageUpload = async () => {
    try {
      if (image) {
        setLoading(true);

        const url = await uploadImage(image);

        setImageUrl(url);
        imageInput.setError("");

        setLoading(false);
      } else {
        imageInput.setError("image required");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  const validateDetails = () => {
    const errors = {};

    if (shopName.value.length < 2) {
      errors.name = "Invalid name";
      shopName.setError("Invalid shop name");
    } else {
      shopName.setError("");
    }

    if (address.value.length < 5) {
      errors.address = "Invalid Address";
      address.setError("Invalid Address");
    } else {
      address.setError("");
    }

    if (cityInput.value.length < 3) {
      errors.city = "Invalid city";
      cityInput.setError("Invalid city");
    } else {
      cityInput.setError("");
    }

    if (!image) {
      errors.image = "image required";
      imageInput.setError("image required");
    } else if (!imageUrl) {
      errors.image = "Upload image first";
      imageInput.setError("Please click upload button");
    } else {
      imageInput.setError("");
    }

    if (!(latitude && longitude)) {
      errors.location = "Allow location";
      locationInput.setError("Allow location permission");
    } else {
      locationInput.setError("");
    }

    const cleaned = whatsappInput.value.replace(/\D/g, "");

    if (cleaned.length !== 10) {
      errors.whatsapp = "Enter valid 10-digit WhatsApp number";
      whatsappInput.setError("Enter valid 10-digit WhatsApp number");
    } else {
      whatsappInput.setError("");
    }

    return errors;
  };

  const createShop = async () => {
    if (loading) return;
    if (!currentUser) return;

    const errors = validateDetails();

    if (Object.keys(errors).length !== 0) return;

    if (imageUrl && latitude && longitude) {
      setLoading(true);

      try {
        const city = cityInput.value.toLowerCase();
        const adminId = currentUser.userId || currentUser.uid;

        await createStore({
          storeName: shopName.value,
          storeAddress: address.value,
          city,
          storeImage: imageUrl,
          storeAdmin: adminId,
          geoLocation: { lat: latitude, lng: longitude },
          whatsapp: "91" + whatsappInput.value.replace(/\D/g, ""),
          status: "pending",
          createdAt: new Date(),
        });

        const docId = currentUser.id || currentUser.uid;

        await updateShopAdminStatus(docId);

        setLoading(false);
        setSubmitted(true);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setImageUrl("");
    }
  };

  return (
    <section
      className="mt-20 mb-10"
      style={{ background: "#FEF3C7" }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">

        <div
          className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0"
          style={{
            background: "#FFF8F0",
            border: "1px solid #F5C89A",
            boxShadow: "0 8px 24px rgba(180,83,9,0.08)",
          }}
        >

          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

            <h1
              className="text-xl font-bold leading-tight tracking-tight md:text-2xl"
              style={{ color: "#7C2D12" }}
            >
              Add Your Shop
            </h1>

            <div className="space-y-4 md:space-y-6">

              {/* Shop Image */}
              <div>
                <label
                  htmlFor="file_input"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Shop Image
                </label>

                <div className="flex flex-row gap-2">

                  <input
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="inline-flex items-center px-2 py-2 rounded-md font-semibold text-xs uppercase tracking-widest shadow-sm transition ease-in-out duration-150"
                    style={{
                      background: "#FEF3C7",
                      border: "1px solid #F5C89A",
                      color: "#92400E",
                    }}
                  />

                  <button
                    onClick={handleImageUpload}
                    type="button"
                    className="text-white font-medium rounded-lg text-sm px-2 py-1 text-center"
                    style={{
                      background:
                        "linear-gradient(to right, #7C2D12, #B45309)",
                    }}
                  >
                    {loading && image && !imageUrl ? (
                      <Spinner />
                    ) : imageUrl ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      "Upload"
                    )}
                  </button>

                </div>

                {imageInput.error && (
                  <p className="text-red-500 text-xs">
                    {imageInput.error}
                  </p>
                )}
              </div>

              {/* Shop Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Shop name
                </label>

                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="xyz shop"
                  required
                  value={shopName.value}
                  onChange={shopName.onChange}
                  className="sm:text-sm rounded-lg block w-full p-2.5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                />

                {shopName.error && (
                  <p className="text-red-500 text-xs">
                    {shopName.error}
                  </p>
                )}
              </div>

              {/* Shop Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Shop Address
                </label>

                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  required
                  value={address.value}
                  onChange={address.onChange}
                  className="sm:text-sm rounded-lg block w-full p-2.5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                />

                {address.error && (
                  <p className="text-red-500 text-xs">
                    {address.error}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  City/District
                </label>

                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City or district"
                  required
                  value={cityInput.value}
                  onChange={cityInput.onChange}
                  className="sm:text-sm rounded-lg block w-full p-2.5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                    color: "#7C2D12",
                  }}
                />

                {cityInput.error && (
                  <p className="text-red-500 text-xs">
                    {cityInput.error}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  WhatsApp Number
                </label>

                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <span
                    className="px-3 py-2.5 text-sm select-none"
                    style={{
                      color: "#92400E",
                      background: "#FFF8F0",
                      borderRight: "1px solid #F5C89A",
                    }}
                  >
                    🇮🇳 +91
                  </span>

                  <input
                    type="tel"
                    name="whatsapp"
                    id="whatsapp"
                    maxLength={10}
                    placeholder="9876543210"
                    value={whatsappInput.value}
                    onChange={whatsappInput.onChange}
                    className="flex-1 bg-transparent sm:text-sm p-2.5 focus:outline-none"
                    style={{ color: "#7C2D12" }}
                  />
                </div>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#92400E" }}
                >
                  Used for customer support via WhatsApp
                </p>

                {whatsappInput.error && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {whatsappInput.error}
                  </p>
                )}
              </div>

              {/* Geo Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Geo Location
                </label>

                <button
                  onClick={requestLocationPermission}
                  type="button"
                  className="text-white font-medium rounded-lg text-sm px-2 py-1 text-center"
                  style={{
                    background:
                      "linear-gradient(to right, #7C2D12, #B45309)",
                  }}
                >
                  Allow Location
                </button>

                {locationInput.error && (
                  <p className="text-red-500 text-xs">
                    {locationInput.error}
                  </p>
                )}

                {latitude && longitude && (
                  <p className="text-green-600 text-xs mt-1">
                    ✔ Location captured!
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={createShop}
                type="button"
                className="w-full flex flex-row items-center justify-center text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                {loading ? <Spinner /> : "Create Shop"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddShop;