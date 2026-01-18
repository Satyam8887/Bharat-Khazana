import React from 'react'
import { Link } from 'react-router-dom'

function Banner() {
  return (
    <div className='flex flex-col text-center items-center justify-center bg-gradient-to-r from-blue-500 to-yellow-500 py-10 md:py-24 font-serif'>
      <h1 className='title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900 tracking-wider'>Find Local Shops Near You<span className='text-white'>.</span></h1>
      <p className='leading-relaxed text-white'>"Using Bharat Khazana helped me find the perfect gifts for my loved ones while<br></br>
        supporting local businesses.It's a win-win!"-user</p>
      <Link to="/findShop">
        <button className="inline-flex text-white bg-orange-500 border-0 py-2 px-4 focus:outline-none hover:scale-105 rounded text-base mt-6 shadow-xl">
          Find Shops
        </button>
      </Link>
    </div>
  )
}

export default Banner