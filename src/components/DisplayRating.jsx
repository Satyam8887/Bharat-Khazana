import React from 'react'

function DisplayRating({ rating }) {
      const maxRating = 5;
    
      return (
        <div className="flex">
          {[...Array(maxRating)].map((_, index) => (
            <svg
              key={index}
              fill={index < rating ? '#FFBF00' : 'gray'}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path
                d="M12 2l1.733 5.121h5.61l-4.568 3.727 1.732 5.121-4.572-3.726-4.569 3.726 1.732-5.121-4.464-3.727h5.6z"
              />
            </svg>
          ))}
        </div>
      );
   
    
}

export default DisplayRating