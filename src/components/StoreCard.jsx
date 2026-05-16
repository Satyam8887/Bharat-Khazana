// components/StoreCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DisplayRating from './DisplayRating';
import WhatsAppButton from './WhatsAppButton';

function StoreCard({ data, dist }) {
  return (
    <div className="md:w-[60%] w-[95%] bg-white rounded-lg border shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 overflow-hidden flex flex-row h-32">

      {/* Wrap only the card content (not the WA button) in Link */}
      <Link to={`/Store?id=${data.id}`} className="flex flex-row flex-1 overflow-hidden">
        {/* Image Side */}
        <div className="w-[35%] md:w-[25%] h-full">
          <img
            className="object-cover w-full h-full"
            src={data.storeImage}
            alt={data.storeName}
          />
        </div>

        {/* Content Side */}
        <div className="flex-1 p-4 flex flex-col justify-between leading-normal overflow-hidden">
          <div>
            <div className="flex justify-between items-start">
              <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 capitalize truncate">
                {data.storeName}
              </h5>
              {/* ✅ FIXED: dist already contains "3.4 km" string from
                  geoDistanceHelper — removed extra " km" that caused "3.4 km km" */}
              {dist && (
                <span className="ml-2 shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {dist}
                </span>
              )}
            </div>
            <p className="mb-1 font-normal text-sm text-gray-700">{data.city}</p>
            <p className="font-normal text-xs text-gray-500 truncate">{data.storeAddress}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <DisplayRating rating={data.rating ?? 4} />
            <span className="text-[#FF5F1F] text-sm font-medium">Visit Store &rarr;</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center px-3 border-l border-gray-100">
        <WhatsAppButton
          shopPhone={data.whatsapp}
          product={{ title: data.storeName }}
        />
      </div>
    </div>
  );
}

export default StoreCard;
