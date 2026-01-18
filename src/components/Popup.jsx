import React from 'react'

function Popup({onClose,children}) {
  return (
    <div   className='fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] backdrop-blur-[2px]  max-h-full flex items-center justify-center'>
        <div className='relative bg-white shadow-xl rounded-lg p-2 max-w-[95%]  '>
         <div className='w-full flex flex-row items-end justify-end pr-1'><button className='' onClick={onClose}>X</button></div>
          {children}  
        </div>
    </div>
  )
}

export default Popup

