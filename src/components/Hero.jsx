import React from 'react'
import heroImg from '../assets/hero_image.jpg'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="container mx-auto flex px-2 py-24 md:flex-row flex-col-reverse items-center font-serif ">
    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900 tracking-wider">Embrace Local Vibes,<br></br> Thrive Local Lives .
      </h1>
      <p className="mb-8 leading-relaxed text-gray-500">Support local with Bharat Khazana. Find nearby shops<br></br> based on your location and shop with confidence.</p>
      <div className="flex justify-center">
      <Link to="/findShop">
      <button className="inline-flex text-white bg-[#FF5F1F] border-0 py-2 px-4 focus:outline-none hover:scale-105 rounded text-base">Find Shops</button>
      </Link>
      </div>
    </div>
    <div className="relative lg:max-w-lg lg:w-full md:w-1/2 w-5/6 ">
      <img className=" object-cover object-center rounded" alt="hero" src={heroImg}/>
    </div>
  </div>
  )
}

export default Hero