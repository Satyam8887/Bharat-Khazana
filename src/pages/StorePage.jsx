// pages/StorePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import storeImage from '../assets/store.png';
import autocompleteSearch from '../hooks/useGetCity'; // Ensure this is a function, not a hook
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
  const { requestLocationPermission, latitude, longitude, locationPermission } = useLocation();

  // Debounced search for city suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        const res = autocompleteSearch(query);
        // Agar result exact match hai toh suggestions band kar do
        if (res && res.length === 1 && res[0].toLowerCase() === query.toLowerCase()) {
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
    setSuggestion([]); // Click karte hi list gayab
  };

  const searchCity = async () => {
    if (!query.trim()) {
      toast.info("Pehle city ka naam likhein!");
      return;
    }

    if (!locationPermission) {
      toast.warn("Location allow karein taaki hum shop ki distance bata sakein!", {
        position: "top-left"
      });
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

  // Memoized distance calculator to prevent unnecessary re-runs
  const calculateDistance = useCallback((shopLocation) => {
    if (locationPermission && latitude && longitude && shopLocation) {
      const userLocation = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
      
      // shopLocation format check: { lat, lng } hona chahiye
      return distanceCalculater(shopLocation, userLocation);
    }
    return null;
  }, [latitude, longitude, locationPermission]);

  return (
    <div className='mt-16 min-h-screen bg-gray-50'>
      
      {/* Search Header */}
      <div className='flex flex-col items-center justify-center py-10 gap-5 bg-white shadow-sm'>
        <h1 className='title-font sm:text-4xl text-3xl mb-2 font-bold text-gray-900 tracking-wider font-serif'>
          Find Shops Near You
        </h1>
        <p className='text-gray-500 mb-2'>Discover treasures from local artisans</p>
        
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4'>
          <div className='relative w-full md:w-96'>
            <input 
              value={query} 
              className='w-full outline-none border-2 border-gray-300 focus:border-[#FF5F1F] rounded-lg p-3 transition-all' 
              placeholder='Enter City (e.g. Sultanpur)' 
              onChange={(e) => setQuery(e.target.value)}
            />
            
            {/* Suggestion Box - Added z-index and better styling */}
            {suggestion.length > 0 && (
              <div className='absolute top-14 left-0 w-full bg-white z-50 rounded-md shadow-2xl border border-gray-100 overflow-hidden'>
                {suggestion.map((data, index) => (
                  <div 
                    className='cursor-pointer p-3 hover:bg-orange-50 border-b last:border-0 text-gray-700 transition' 
                    onClick={() => handleSuggestion(data)} 
                    key={index}
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
                className='flex-1 md:flex-none text-white bg-[#FF5F1F] border-0 py-3 px-8 focus:outline-none hover:bg-[#e04e15] rounded-lg text-base font-semibold shadow-md transition-all active:scale-95'
              >
                Search
              </button>
              
              {!locationPermission && (
                  <button 
                    onClick={requestLocationPermission} 
                    className='flex-1 md:flex-none text-[#FF5F1F] border-2 border-[#FF5F1F] bg-white py-3 px-4 rounded-lg text-sm font-bold hover:bg-orange-50 transition'
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
            <h2 className='text-2xl font-semibold text-gray-700'>Bharat Khazana awaits!</h2>
            <p className="text-gray-500 mt-2">Search your city and explore local products.</p>
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
      
      <ToastContainer autoClose={2500} hideProgressBar={false} theme="colored" />
    </div>
  );
}

export default StorePage;