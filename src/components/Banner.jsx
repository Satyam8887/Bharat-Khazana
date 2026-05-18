import React from 'react'
import { Link } from 'react-router-dom'

function Banner() {
  return (
    <div
      className='flex flex-col text-center items-center justify-center py-10 md:py-24 font-serif'
      style={{
        background:
          "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
      }}
    >
      <h1
        className='title-font sm:text-4xl text-3xl mb-4 font-bold tracking-wider'
        style={{ color: "#FEF3C7" }}
      >
        Find Local Shops Near You
        <span className='text-white'>.</span>
      </h1>

      <p
        className='leading-relaxed'
        style={{ color: "#FFF8F0" }}
      >
        "Using Bharat Khazana helped me find the perfect gifts for my loved ones while
        <br></br>
        supporting local businesses. It's a win-win!" - user
      </p>

      <Link to="/findShop">
        <button
          className="inline-flex text-white border-0 py-2 px-4 focus:outline-none hover:scale-105 rounded text-base mt-6 shadow-xl transition-all duration-300"
          style={{
            background: "#B45309",
          }}
        >
          Find Shops
        </button>
      </Link>
    </div>
  )
}

export default Banner