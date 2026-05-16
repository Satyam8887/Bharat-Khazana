// src/components/StoreGridCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DisplayRating from './DisplayRating';
import WhatsAppButton from './WhatsAppButton';

function StoreGridCard({ data, dist }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col h-full border border-gray-100">

      {/* Wrap image + content in Link, keep WA button outside */}
      <Link to={`/Store?id=${data.id}`} className="flex flex-col flex-1">
        {/* Image Section */}
        <div className="w-full h-48 relative">
          <img
            className="object-cover w-full h-full"
            src={data.storeImage || "https://dummyimage.com/600x400/e0e0e0/000"}
            alt={data.storeName}
          />

          {/* Distance Badge — dist is already "3.4 km" string, no suffix needed */}
          {dist && (
            <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
              {dist}
            </span>
          )}

          {/* Out of Stock overlay */}
          {data.inStock === false && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-lg font-bold text-gray-900 capitalize truncate mb-1">
              {data.storeName}
            </h3>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
              📍 {data.city}
            </p>
            <p className="text-xs text-gray-400 line-clamp-2">{data.storeAddress}</p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <DisplayRating rating={data.rating ?? 4} />
            <span className="text-[#FF5F1F] text-sm font-semibold">View Shop</span>
          </div>
        </div>
      </Link>


      <div className="px-4 pb-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Contact seller</span>
        <WhatsAppButton
          shopPhone={data.whatsapp}
          product={{ title: data.storeName }}
        />
      </div>
    </div>
  );
}

export default StoreGridCard;
