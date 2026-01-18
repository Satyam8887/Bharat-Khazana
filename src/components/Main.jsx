// components/Main.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStores } from "../api/firestoreApi";
import StoreGridCard from "./StoreGridCard"; // 👈 Naya Card Import karein
import Spinner from "./Spinner";
import useLocation from "../hooks/useLocation";
import distanceCalculater from "../helper/geoDistanceHelper";

function Main() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude, locationPermission } = useLocation();

  useEffect(() => {
    fetchAllStores();
  }, []);

  const fetchAllStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStores();
      setStores(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const calculateDistance = (shopLocation) => {
    if (locationPermission && latitude && longitude && shopLocation) {
      const userLocation = { lat: latitude, lng: longitude };
      return distanceCalculater(shopLocation, userLocation);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      
      {/* Hero Section */}
      <div className="bg-[#FF5F1F] text-white py-16 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif">
            Bharat Khazana
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Find authentic local shops near you.
          </p>
          <Link to="/findShop" className="bg-white text-[#FF5F1F] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition">
            Search by City
          </Link>
        </div>
      </div>

      {/* 🔹 GRID SECTION START */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#FF5F1F] pl-3">
              Explore Stores
            </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          stores.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No stores found.</div>
          ) : (
            // ✅ CSS GRID LAYOUT: Mobile=1, Tablet=2, Laptop=3, Desktop=4 columns
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stores.map((store) => (
                <StoreGridCard 
                    key={store.id} 
                    data={store} 
                    dist={calculateDistance(store.geoLocation)} 
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Main;