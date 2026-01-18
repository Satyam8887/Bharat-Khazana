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
  // 1. Context se user aur authLoading nikala
  const { user, loading: authLoading } = useFirebase();
  const navigate = useNavigate();

  // Local component states
  const [loading, setLoading] = useState(false); // Form submission loading
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const {
    requestLocationPermission,
    latitude,
    longitude,
  } = useLocation();

  const shopName = useFormInput("");
  const address = useFormInput("");
  const cityInput = useFormInput("");
  const imageInput = useFormInput("");
  const locationInput = useFormInput("");

  // Normalize user (Just in case)
  const currentUser = Array.isArray(user) ? user[0] : user;

  // 2. Protected Route Logic
  useEffect(() => {
    // Step A: Agar Firebase abhi check kar raha hai, to wait karo
    if (authLoading) return;

    // Step B: Checking khatam, ab agar user nahi hai to login pe bhejo
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading, navigate]);

  // 3. UI Blocker during Auth Check
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Agar user null hai (redirect hone wala hai), to content render mat karo
  if (!currentUser) return null;

  const handleImageUpload = async () => {
    try {
      if (image) {
        setLoading(true); // Upload ke time thoda load dikha sakte hain
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
      throw error;
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
      errors.image = "Upload image first"; // Message updated slightly
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

    return errors;
  };

  const createShop = async () => {
    if (loading) return;

    // Safety check
    if (!currentUser) return;

    const errors = validateDetails();

    // Check if errors exist
    if (Object.keys(errors).length !== 0) return;

    if (imageUrl && latitude && longitude) {
        setLoading(true);
      try {
        const city = cityInput.value.toLowerCase();
        
        // 4. User ID Selection (userId from custom logic OR uid from firebase auth)
        const adminId = currentUser.userId || currentUser.uid;

        await createStore({
          storeName: shopName.value,
          storeAddress: address.value,
          city,
          storeImage: imageUrl,
          storeAdmin: adminId, 
          geoLocation: { lat: latitude, lng: longitude },
        });

        // Update user status
        // Agar firestore ID alag hai to wo use karein, nahi to uid
        const docId = currentUser.id || currentUser.uid; 
        await updateShopAdminStatus(docId);

        setLoading(false);
        navigate("/manageStore");
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
      // Optional: Reset URL if user selects new image but hasn't uploaded yet
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
                <label
                  htmlFor="file_input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="inline-flex items-center px-2 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 "
                  />
                  <button
                    onClick={handleImageUpload}
                    type="button"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                  >
                    {imageUrl ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
                {imageInput.error && (
                  <p className="text-red-500 text-xs">{imageInput.error}</p>
                )}
              </div>

              {/* Shop Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="xyz shop"
                  required
                  value={shopName.value}
                  onChange={shopName.onChange}
                />
                {shopName.error && (
                  <p className="text-red-500 text-xs">{shopName.error}</p>
                )}
              </div>

              {/* Shop Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Address"
                  required
                  value={address.value}
                  onChange={address.onChange}
                />
                {address.error && (
                  <p className="text-red-500 text-xs">{address.error}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  City/District
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="City or district"
                  required
                  value={cityInput.value}
                  onChange={cityInput.onChange}
                />
                {cityInput.error && (
                  <p className="text-red-500 text-xs">{cityInput.error}</p>
                )}
              </div>

              {/* Geo Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Geo Location
                </label>
                <button
                  onClick={requestLocationPermission}
                  type="button"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                >
                  Allow Location
                </button>
                {locationInput.error && (
                  <p className="text-red-500 text-xs">{locationInput.error}</p>
                )}
                {latitude && longitude && (
                    <p className="text-green-500 text-xs mt-1">Location captured!</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={createShop}
                type="submit"
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