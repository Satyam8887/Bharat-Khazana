// src/components/StoreGridCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DisplayRating from './DisplayRating'; // Agar rating component hai to

function StoreGridCard({ data, dist }) {
  return (
    <Link 
      to={`/Store?id=${data.id}`} 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col h-full border border-gray-100"
    >
      {/* 🔹 Image Section (Full Width, Fixed Height) */}
      <div className="w-full h-48 relative">
        <img 
          className="object-cover w-full h-full" 
          src={data.storeImage || "https://dummyimage.com/600x400/e0e0e0/000"} 
          alt={data.storeName} 
        />
        {/* Distance Badge on Image */}
        {dist && (
          <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            {dist} away
          </span>
        )}
      </div>

      {/* 🔹 Content Section */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
            <div className='flex justify-between items-start'>
                <h3 className="text-lg font-bold text-gray-900 capitalize truncate mb-1">
                    {data.storeName}
                </h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
               📍 {data.city}
            </p>
            <p className="text-xs text-gray-400 line-clamp-2">
               {data.storeAddress}
            </p>
        </div>

        {/* Footer (Rating & Button) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <DisplayRating rating={4} /> 
            <span className="text-[#FF5F1F] text-sm font-semibold group-hover:underline">
              View Shop
            </span>
        </div>
      </div>
    </Link>
  );
}

export default StoreGridCard;