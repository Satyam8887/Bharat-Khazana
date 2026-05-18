// src/components/StoreGridCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DisplayRating from './DisplayRating';
import WhatsAppButton from './WhatsAppButton';

function StoreGridCard({ data, dist }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col h-full"
      style={{
        border: "1px solid #F5C89A",
        boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
      }}
    >

      {/* Wrap image + content in Link, keep WA button outside */}
      <Link
        to={`/Store?id=${data.id}`}
        className="flex flex-col flex-1"
      >

        {/* Image Section */}
        <div
          className="w-full h-48 relative"
          style={{ background: "#FEF3C7" }}
        >

          <img
            className="object-cover w-full h-full"
            src={data.storeImage || "https://dummyimage.com/600x400/e0e0e0/000"}
            alt={data.storeName}
          />

          {/* Distance Badge */}
          {dist && (
            <span
              className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm"
              style={{
                background: "rgba(124,45,18,0.85)",
                color: "#FEF3C7",
              }}
            >
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

            <h3
              className="text-lg font-bold capitalize truncate mb-1"
              style={{ color: "#7C2D12" }}
            >
              {data.storeName}
            </h3>

            <p
              className="text-sm mb-1 flex items-center gap-1"
              style={{ color: "#B45309" }}
            >
              📍 {data.city}
            </p>

            <p
              className="text-xs line-clamp-2"
              style={{ color: "#92400E" }}
            >
              {data.storeAddress}
            </p>

          </div>

          {/* Footer */}
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{
              borderTop: "1px solid #F5C89A",
            }}
          >

            <DisplayRating rating={data.rating ?? 4} />

            <span
              className="text-sm font-semibold"
              style={{
                color: "#B45309",
              }}
            >
              View Shop
            </span>

          </div>
        </div>
      </Link>

      {/* WhatsApp Section */}
      <div
        className="px-4 pb-3 pt-2 flex items-center justify-between"
        style={{
          borderTop: "1px solid #F5C89A",
          background: "#FFF8F0",
        }}
      >

        <span
          className="text-xs"
          style={{ color: "#92400E" }}
        >
          Contact seller
        </span>

        <WhatsAppButton
          shopPhone={data.whatsapp}
          product={{ title: data.storeName }}
        />

      </div>
    </div>
  );
}

export default StoreGridCard;