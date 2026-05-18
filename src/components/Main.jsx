// components/Main.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllStores } from "../api/firestoreApi";
import StoreGridCard from "./StoreGridCard";
import Spinner from "./Spinner";
import useLocation from "../hooks/useLocation";
import distanceCalculater from "../helper/geoDistanceHelper";

function Main() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const { requestLocationPermission, latitude, longitude, locationPermission } = useLocation();

  useEffect(() => {
    fetchAllStores();
    requestLocationPermission();
  }, []);

  const fetchAllStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStores();
      setStores(res || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const storesWithDistance = useMemo(() => {
    return stores.map(store => {
      let distance = null;
      if (locationPermission && latitude && longitude && store.geoLocation) {
        const userLoc = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        const shopLoc = {
          lat: parseFloat(store.geoLocation.lat || store.geoLocation.latitude),
          lng: parseFloat(store.geoLocation.lng || store.geoLocation.longitude)
        };
        distance = distanceCalculater(shopLoc, userLoc);
      }
      return { ...store, calculatedDist: distance };
    });
  }, [stores, latitude, longitude, locationPermission]);

  return (
    <div className="min-h-screen mt-16" style={{ background: "#FEF3C7" }}>

      {/* Hero Section */}
      <div
        className="text-white py-16 px-4 mb-10"
        style={{ background: "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)" }}
      >
        <div className="container mx-auto text-center">
          <span
            className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}
          >
            Discover India's Heritage
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif text-white">
            Bharat Khazana
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: "rgba(255,255,255,0.88)" }}>
            Find authentic local shops near you.
          </p>
          <Link
            to="/findShop"
            className="inline-block font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#B45309", color: "#FEF3C7" }}
          >
            Search by City
          </Link>
        </div>
      </div>

      {/* Store Listing */}
      <div className="container mx-auto px-4 pb-10">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold pl-4"
            style={{
              color: "#7C2D12",
              borderLeft: "4px solid #B45309",
            }}
          >
            Explore Stores
          </h2>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : storesWithDistance.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl text-base font-medium"
            style={{ color: "#92400E", background: "#FFF8F0" }}
          >
            No stores found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {storesWithDistance.map((store) => (
              <StoreGridCard
                key={store.id}
                data={store}
                dist={store.calculatedDist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;