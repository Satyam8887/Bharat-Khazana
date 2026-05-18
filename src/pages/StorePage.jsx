// pages/StorePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import storeImage from '../assets/store.png';
import autocompleteSearch from '../hooks/useGetCity';
import StoreCard from '../components/StoreCard';
import { getStoreByCity } from '../api/firestoreApi';
import useLocation from '../hooks/useLocation';
import distanceCalculater from '../helper/geoDistanceHelper';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Spinner from '../components/Spinner';

function StorePage() {

  const [suggestion, setSuggestion] = useState([]);
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom hook for location
  const {
    requestLocationPermission,
    latitude,
    longitude,
    locationPermission
  } = useLocation();

  // Debounced search for city suggestions
  useEffect(() => {

    const timer = setTimeout(() => {

      if (query.trim().length > 2) {

        const res = autocompleteSearch(query);

        if (
          res &&
          res.length === 1 &&
          res[0].toLowerCase() === query.toLowerCase()
        ) {

          setSuggestion([]);

        } else {

          setSuggestion(res || []);
        }

      } else {

        setSuggestion([]);
      }

    }, 400);

    return () => clearTimeout(timer);

  }, [query]);

  const handleSuggestion = (data) => {
    setQuery(data);
    setSuggestion([]);
  };

  const searchCity = async () => {

    if (!query.trim()) {
      toast.info("Pehle city ka naam likhein!");
      return;
    }

    if (!locationPermission) {

      toast.warn(
        "Location allow karein taaki hum shop ki distance bata sakein!",
        {
          position: "top-left"
        }
      );
    }

    setLoading(true);

    try {

      const res = await getStoreByCity(query.trim());

      setStores(res || []);

      if (res && res.length === 0) {
        toast.error("Is city mein koi shop nahi mili.");
      }

    } catch (err) {

      toast.error("Data fetch karne mein error aaya.");

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // Memoized distance calculator
  const calculateDistance = useCallback((shopLocation) => {

    if (
      locationPermission &&
      latitude &&
      longitude &&
      shopLocation
    ) {

      const userLocation = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };

      return distanceCalculater(shopLocation, userLocation);
    }

    return null;

  }, [latitude, longitude, locationPermission]);

  return (

    <div
      className='mt-16 min-h-screen'
      style={{ background: "#FEF3C7" }}
    >

      {/* Search Header */}
      <div
        className='flex flex-col items-center justify-center py-10 gap-5 shadow-sm'
        style={{
          background: "#FFF8F0",
          borderBottom: "2px solid #F5C89A",
        }}
      >

        <h1
          className='title-font sm:text-4xl text-3xl mb-2 font-bold tracking-wider font-serif'
          style={{ color: "#7C2D12" }}
        >
          Find Shops Near You
        </h1>

        <p
          className='mb-2'
          style={{ color: "#92400E" }}
        >
          Discover treasures from local artisans
        </p>

        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4'>

          <div className='relative w-full md:w-96'>

            <input
              value={query}
              className='w-full outline-none border-2 rounded-lg p-3 transition-all'
              style={{
                borderColor: "#F5C89A",
                background: "#FEF3C7",
                color: "#7C2D12",
              }}
              placeholder='Enter City (e.g. Sultanpur)'
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Suggestion Box */}
            {suggestion.length > 0 && (

              <div
                className='absolute top-14 left-0 w-full z-50 rounded-md shadow-2xl overflow-hidden'
                style={{
                  background: "#FFF8F0",
                  border: "1px solid #F5C89A",
                }}
              >

                {suggestion.map((data, index) => (

                  <div
                    className='cursor-pointer p-3 border-b last:border-0 transition'
                    style={{
                      color: "#7C2D12",
                      borderColor: "#F5C89A",
                    }}
                    onClick={() => handleSuggestion(data)}
                    key={index}
                    onMouseEnter={(e) =>
                      e.currentTarget.style.background = "#FEF3C7"
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.style.background = "transparent"
                    }
                  >
                    {data}
                  </div>

                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">

            <button
              onClick={searchCity}
              className='flex-1 md:flex-none text-white border-0 py-3 px-8 focus:outline-none rounded-lg text-base font-semibold shadow-md transition-all active:scale-95'
              style={{
                background:
                  "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              }}
            >
              Search
            </button>

            {!locationPermission && (

              <button
                onClick={requestLocationPermission}
                className='flex-1 md:flex-none py-3 px-4 rounded-lg text-sm font-bold transition'
                style={{
                  color: "#B45309",
                  border: "2px solid #B45309",
                  background: "#FFF8F0",
                }}
              >
                📍 Get Location
              </button>

            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className='max-w-6xl mx-auto flex flex-col gap-6 py-10 items-center px-4'>

        {loading && <Spinner />}

        {!loading && stores.length === 0 && (

          <div className='flex flex-col items-center opacity-80 mt-10 text-center'>

            <img
              src={storeImage}
              alt='No stores found'
              className="w-56 h-56 object-contain mb-6 grayscale-[30%]"
            />

            <h2
              className='text-2xl font-semibold'
              style={{ color: "#7C2D12" }}
            >
              Bharat Khazana awaits!
            </h2>

            <p
              className="mt-2"
              style={{ color: "#92400E" }}
            >
              Search your city and explore local products.
            </p>

          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

          {stores.map((data) => (

            <StoreCard
              data={data}
              key={data?.id || Math.random()}
              dist={calculateDistance(data.geoLocation)}
            />

          ))}
        </div>
      </div>

      <ToastContainer
        autoClose={2500}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
}

export default StorePage;