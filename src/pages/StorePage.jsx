// pages/StorePage.jsx
import React, { useEffect, useState } from 'react';
import storeImage from '../assets/store.png';
import autocompleteSearch from '../hooks/useGetCity'; // Ensure this hook works
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
  const [loading, setLoading] = useState(false); // Loading state added
  
  const { requestLocationPermission, latitude, longitude, locationPermission } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(query.length > 2) { // 2 letter ke baad search kare
        const res = autocompleteSearch(query);
        if ((res && res?.length === 1) && res[0] === query) {
          setSuggestion([]);
        } else {
          setSuggestion(res);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSuggestion = (data) => {
    setQuery(data);
    setSuggestion([]);
  };

  const searchCity = async () => {
    if (!locationPermission) {
      toast.warn("Allow location permission to view shop distance!", {
        position: "top-left" // Fixed syntax for Toastify v9+
      });
    }

    if(!query) return;

    setLoading(true);
    const res = await getStoreByCity(query);
    setStores(res);
    setLoading(false);
  };

  const calculateDistance = (shopLocation) => {
  // Check: Location permission mili hai aur user ke coordinates hain?
  if (locationPermission && latitude && longitude && shopLocation) {
    
    const userLocation = {
      lat: parseFloat(latitude), // String ko number me badalna zaroori hai
      lng: parseFloat(longitude)
    };
    
    // Helper function call karo
    const result = distanceCalculater(shopLocation, userLocation);
    return result; // Ye string return karega (e.g. "5.2 km")
  }
  return null;
};

  return (
    <div className='mt-16 min-h-screen bg-gray-50'>
      
      {/* Search Header */}
      <div className='flex flex-col items-center justify-center py-10 gap-5 bg-white shadow-sm'>
        <h1 className='title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900 tracking-wider font-serif'>
          Find Shops Near You
        </h1>
        
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4'>
          <div className='relative w-full md:w-96'>
            <input 
              value={query} 
              className='w-full outline-none border-2 border-gray-300 focus:border-[#FF5F1F] rounded-lg p-2 transition-colors' 
              placeholder='Enter City (e.g. Sultanpur)' 
              onChange={(e) => setQuery(e.target.value)}
            />
            {suggestion && suggestion.length !== 0 && (
              <div className='absolute top-12 max-h-40 overflow-y-auto w-full bg-white z-10 rounded-md shadow-xl border'>
                {suggestion.map((data, index) => (
                  <p 
                    className='cursor-pointer p-2 hover:bg-gray-100 border-b last:border-0' 
                    onClick={() => handleSuggestion(data)} 
                    key={index}
                  >
                    {data}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
              <button 
                onClick={searchCity} 
                className='text-white bg-[#FF5F1F] border-0 py-2 px-6 focus:outline-none hover:bg-[#e04e15] rounded-lg text-base shadow-md transition'
              >
                Search
              </button>
              
              {!locationPermission && (
                  <button 
                    onClick={requestLocationPermission} 
                    className='text-[#FF5F1F] border border-[#FF5F1F] bg-white py-2 px-4 rounded-lg text-base hover:bg-orange-50 transition'
                  >
                    📍 Allow Location
                  </button>
              )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className='w-full flex flex-col gap-4 py-8 items-center px-4'>
        
        {loading && <Spinner />}

        {!loading && stores.length === 0 && (
          <div className='flex flex-col items-center opacity-70 mt-10'>
            <img src={storeImage} alt='store' className="w-64 h-64 object-contain mix-blend-multiply" />
            <p className="text-xl text-gray-500 font-medium mt-4">Search for a city to find shops</p>
          </div>
        )}

        {stores.map((data) => (
          <StoreCard 
            data={data} 
            key={data?.id} 
            dist={calculateDistance(data.geoLocation)} 
          />
        ))}
      </div>
      
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default StorePage;