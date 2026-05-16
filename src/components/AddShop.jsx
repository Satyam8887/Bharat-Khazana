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

  // ✅ NEW: Show a "pending approval" screen after successful submission
  // instead of silently redirecting. This avoids confusion when the shop
  // doesn't immediately appear because status is "pending".
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

  // ✅ NEW: Pending approval screen — shown after form submit
  // Replaces the silent redirect to /manageStore which confused users
  // whose shops were stuck in "pending" status with no explanation.
  if (submitted) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 mt-20 mb-10 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto">
          <div className="w-full sm:max-w-md bg-white rounded-lg shadow p-8 text-center dark:bg-gray-800">
            {/* Pending Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Shop Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Your shop <span className="font-semibold text-[#FF5F1F]">{shopName.value}</span> has been submitted successfully.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              It is currently <span className="font-semibold text-yellow-600">pending approval</span> by our admin team.
              You'll be able to manage your store once it's approved. This usually takes 24–48 hours.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/manageStore")}
                className="w-full text-white bg-[#FF5F1F] hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Go to My Store
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:text-white"
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

    // ✅ WhatsApp validation: must be exactly 10 digits
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
        // ✅ FIXED: Show pending screen instead of silently redirecting.
        // Previously navigate("/manageStore") ran immediately, confusing users
        // who saw an empty store with no explanation of the pending status.
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
    <section className="bg-gray-50 dark:bg-gray-900 mt-20 mb-10">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Add Your Shop
            </h1>
            <div className="space-y-4 md:space-y-6">

              {/* Shop Image */}
              <div>
                <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Shop Image
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="inline-flex items-center px-2 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 active:bg-gray-50 transition ease-in-out duration-150"
                  />
                  <button
                    onClick={handleImageUpload}
                    type="button"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                  >
                    {/* ✅ FIXED: Show Spinner during upload, not just when imageUrl is set */}
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
                {imageInput.error && <p className="text-red-500 text-xs">{imageInput.error}</p>}
              </div>

              {/* Shop Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Shop name
                </label>
                <input
                  type="text" name="name" id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="xyz shop" required
                  value={shopName.value} onChange={shopName.onChange}
                />
                {shopName.error && <p className="text-red-500 text-xs">{shopName.error}</p>}
              </div>

              {/* Shop Address */}
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Shop Address
                </label>
                <input
                  type="text" name="address" id="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Address" required
                  value={address.value} onChange={address.onChange}
                />
                {address.error && <p className="text-red-500 text-xs">{address.error}</p>}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  City/District
                </label>
                <input
                  type="text" name="city" id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="City or district" required
                  value={cityInput.value} onChange={cityInput.onChange}
                />
                {cityInput.error && <p className="text-red-500 text-xs">{cityInput.error}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="whatsapp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  WhatsApp Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  {/* Country code prefix */}
                  <span className="px-3 py-2.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="whatsapp"
                    id="whatsapp"
                    maxLength={10}
                    className="flex-1 bg-transparent text-gray-900 sm:text-sm p-2.5 focus:outline-none dark:text-white dark:placeholder-gray-400"
                    placeholder="9876543210"
                    value={whatsappInput.value}
                    onChange={whatsappInput.onChange}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Used for customer support via WhatsApp</p>
                {whatsappInput.error && <p className="text-red-500 text-xs mt-0.5">{whatsappInput.error}</p>}
              </div>

              {/* Geo Location */}
              <div>
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Geo Location
                </label>
                <button
                  onClick={requestLocationPermission}
                  type="button"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                >
                  Allow Location
                </button>
                {locationInput.error && <p className="text-red-500 text-xs">{locationInput.error}</p>}
                {latitude && longitude && (
                  <p className="text-green-500 text-xs mt-1">✔ Location captured!</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={createShop}
                type="button"
                className="w-full flex flex-row items-center justify-center text-white bg-[#FF5F1F] hover:scale-105 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
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
