import React from 'react';
import { useFirebase } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductCard({ data }) {
  const { addToCart, user } = useFirebase();
  const navigate = useNavigate();

  // 1. Details page par jaane ka function
  const openDetails = () => {
    navigate(`/product/${data.id}`);
  };

  // 2. Add to Cart function (Stop Propagation zaroori hai)
  const handleAddToCart = (e) => {
    e.stopPropagation(); // 🛑 Ye line zaroori hai! Taaki "Add" dabane par Details page na khul jaye
    
    if (!user) {
      toast.warn("Please Login to add items!");
      navigate("/login");
      return;
    }
    addToCart(data);
    toast.success("Added to Cart");
  };

  return (
    // ✅ Card ke main div par onClick lagaya
    <div 
      onClick={openDetails} 
      className="bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
    >
      
      {/* Product Image */}
      <div className='h-48 overflow-hidden rounded-t-lg relative bg-white'>
        <img 
            className="object-cover w-full h-full transform group-hover:scale-110 transition duration-500" 
            src={data.imageUrl || "https://dummyimage.com/400x300"} 
            alt={data.title} 
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
            <h5 className="text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-[#FF5F1F] transition-colors">
                {data.title}
            </h5>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                {data.description}
            </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">
            ₹{data.price}
          </span>
          
          {/* Add Button */}
          <button 
            onClick={handleAddToCart} // 👈 Yahan e.stopPropagation() wala function call hoga
            className="text-white bg-[#FF5F1F] hover:bg-orange-600 font-medium rounded-lg text-sm px-4 py-2 transition shadow-md z-10"
          >
            Add +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;