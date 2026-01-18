// components/StoreCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DisplayRating from './DisplayRating'; // Agar aapke paas hai

function StoreCard({ data, dist }) {
  return (
    <Link 
      to={`/Store?id=${data.id}`} 
      className="md:w-[60%] w-[95%] bg-white rounded-lg border shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 overflow-hidden flex flex-row h-32 cursor-pointer"
    >
      {/* Image Side */}
      <div className="w-[35%] md:w-[25%] h-full">
        <img 
          className="object-cover w-full h-full" 
          src={data.storeImage} 
          alt={data.storeName} 
        />
      </div>

      {/* Content Side */}
      <div className="w-[65%] md:w-[75%] p-4 flex flex-col justify-between leading-normal">
        <div>
          <div className="flex justify-between items-start">
            <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 capitalize">
              {data.storeName}
            </h5>
            {/* Distance Badge */}
            {dist && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                {dist} km
              </span>
            )}
          </div>
          <p className="mb-1 font-normal text-sm text-gray-700">
            {data.city}
          </p>
          <p className="font-normal text-xs text-gray-500 truncate">
            {data.storeAddress}
          </p>
        </div>
        
        {/* Rating or Arrow */}
        <div className="flex items-center justify-between mt-2">
           <DisplayRating rating={4} /> 
           <span className="text-[#FF5F1F] text-sm font-medium">Visit Store &rarr;</span>
        </div>
      </div>
    </Link>
  );
}

export default StoreCard;