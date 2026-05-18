import React from 'react'

function Popup({ onClose, children }) {
  return (

    <div
      className='fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] backdrop-blur-[2px] max-h-full flex items-center justify-center'
      style={{
        background: "rgba(124,45,18,0.18)",
      }}
    >

      <div
        className='relative shadow-xl rounded-2xl p-3 max-w-[95%]'
        style={{
          background: "#FFF8F0",
          border: "1px solid #F5C89A",
          boxShadow: "0 10px 30px rgba(180,83,9,0.15)",
        }}
      >

        {/* Close Button */}
        <div className='w-full flex flex-row items-end justify-end pr-1'>

          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full font-semibold transition-all duration-200 hover:scale-105'
            style={{
              background: "#FEF3C7",
              color: "#7C2D12",
              border: "1px solid #F5C89A",
            }}
          >
            ✕
          </button>

        </div>

        {children}

      </div>
    </div>
  )
}

export default Popup