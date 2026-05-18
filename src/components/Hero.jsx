import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section
      className="relative w-full flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
        minHeight: "420px",
      }}
    >
      {/* Badge */}
      <span
        className="mb-6 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full"
        style={{
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          letterSpacing: "0.12em",
        }}
      >
        Discover India's Heritage
      </span>

      {/* Heading */}
      <h1
        className="font-serif font-extrabold text-white mb-5 leading-tight"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          textShadow: "0 2px 16px rgba(0,0,0,0.12)",
        }}
      >
        Explore the Treasures
        <br />
        of Bharat
      </h1>

      {/* Subtext */}
      <p
        className="mb-10 text-base md:text-lg max-w-xl"
        style={{ color: "rgba(255,255,255,0.88)" }}
      >
        Uncover stories, art, and culture from across the nation
      </p>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">

        <Link to="/findShop">
          <button
            className="font-semibold px-8 py-3 rounded-full text-sm md:text-base transition-all duration-200 hover:scale-105"
            style={{
              background: "#FEF3C7",
              color: "#7C2D12",
              border: "none",
            }}
          >
            Explore Now
          </button>
        </Link>

        <Link to="/findShop">
          <button
            className="font-semibold px-8 py-3 rounded-full text-sm md:text-base transition-all duration-200 hover:scale-105"
            style={{
              background: "#B45309",
              color: "#fff",
              border: "none",
            }}
          >
            Learn More
          </button>
        </Link>

      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full"
        style={{ background: "rgba(0,0,0,0.35)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero;