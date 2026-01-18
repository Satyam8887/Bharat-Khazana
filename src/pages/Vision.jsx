import React from 'react';
import { Link } from 'react-router-dom';

function Vision() {
  return (
    <div className="bg-white min-h-screen mt-16">
      
      {/* 🔹 SECTION 1: HERO BANNER (Gradient & Bold Text) */}
      <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20 px-6">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif mb-4 tracking-wide drop-shadow-md">
            Empowering Bharat
          </h1>
          <p className="text-lg md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
            Connecting every local shopkeeper to the digital world. 
            Bridging the gap between tradition and technology.
          </p>
        </div>
        {/* Background Pattern Overlay (Optional) */}
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
      </div>

      {/* 🔹 SECTION 2: OUR STORY (Image + Text) */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1550587542-00b659c0490b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Indian Market" 
              className="rounded-xl shadow-2xl hover:scale-105 transition duration-500 transform rotate-2 hover:rotate-0"
            />
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-[#FF5F1F] pl-4">
              Why We Started?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              India is a land of hidden treasures. Every street has a shop with a story, and every product has a legacy. But in the race of big e-commerce giants, our local 
              <span className="font-bold text-[#FF5F1F]"> 'Kirana stores'</span> and 
              <span className="font-bold text-[#FF5F1F]"> 'Artisans'</span> are being left behind.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              <strong>Bharat Khazana</strong> is not just an app; it's a movement. A movement to give a digital identity to every local seller, helping them compete, grow, and thrive in the modern economy.
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 3: OUR CORE VALUES (Grid Cards) */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Core Values</h2>
            <div className="w-20 h-1 bg-[#FF5F1F] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center border-t-4 border-[#FF5F1F]">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF5F1F]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Vocal for Local</h3>
              <p className="text-gray-600">Promoting indigenous products and supporting the local economy to build a self-reliant India.</p>
            </div>

            {/* Value Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center border-t-4 border-green-500">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Quality</h3>
              <p className="text-gray-600">We ensure that every product listed comes from verified local sellers, ensuring authenticity.</p>
            </div>

            {/* Value Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center border-t-4 border-blue-500">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Digital Growth</h3>
              <p className="text-gray-600">Providing cutting-edge tools to small businesses to help them scale and manage operations easily.</p>
            </div>

          </div>
        </div>
      </div>

      {/* 🔹 SECTION 4: CALL TO ACTION (Join the movement) */}
      <div className="bg-[#1a1a1a] text-white py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Ready to be a part of the change?</h2>
            <p className="text-gray-400">Join Bharat Khazana today as a seller or a buyer.</p>
          </div>
          <div className="flex gap-4">
             <Link to="/AddYourShop">
                <button className="bg-[#FF5F1F] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:scale-105">
                  Become a Seller
                </button>
             </Link>
             <Link to="/login">
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full transition">
                  Start Shopping
                </button>
             </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Vision;