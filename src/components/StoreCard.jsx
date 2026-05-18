import React from "react";
import { Link } from "react-router-dom";
import DisplayRating from "./DisplayRating";
import WhatsAppButton from "./WhatsAppButton";

function StoreCard({ data, dist }) {
  return (
    <div
      className="w-full bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-row"
      style={{
        border: "1px solid #F5C89A",
        boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
      }}
    >

      {/* Card Content */}
      <Link
        to={`/Store?id=${data.id}`}
        className="flex flex-row flex-1 overflow-hidden"
      >

        {/* Image */}
        <div
          className="w-[35%] md:w-[28%] h-[180px] overflow-hidden"
          style={{ background: "#FEF3C7" }}
        >

          <img
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            src={data.storeImage}
            alt={data.storeName}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">

          {/* Top */}
          <div>

            <div className="flex items-start justify-between gap-3">

              <h5
                className="text-xl font-bold capitalize font-serif line-clamp-1"
                style={{ color: "#7C2D12" }}
              >
                {data.storeName}
              </h5>

              {dist && (
                <span
                  className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "#FEF3C7",
                    color: "#B45309",
                  }}
                >
                  {dist}
                </span>
              )}
            </div>

            <p
              className="text-sm font-medium mt-2 capitalize"
              style={{ color: "#B45309" }}
            >
              📍 {data.city}
            </p>

            <p
              className="text-sm mt-2 line-clamp-2 leading-relaxed"
              style={{ color: "#92400E" }}
            >
              {data.storeAddress}
            </p>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-5">

            <DisplayRating rating={data.rating ?? 4} />

            <span
              className="text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Visit Store →
            </span>

          </div>
        </div>
      </Link>

      {/* WhatsApp Button */}
      <div
        className="flex items-center justify-center px-4"
        style={{
          borderLeft: "1px solid #F5C89A",
          background: "#FFF8F0",
        }}
      >
        <WhatsAppButton
          shopPhone={data.whatsapp}
          product={{ title: data.storeName }}
        />
      </div>
    </div>
  );
}

export default StoreCard;