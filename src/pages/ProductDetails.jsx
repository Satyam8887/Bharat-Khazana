import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/firestoreApi'; 
import { useFirebase } from '../context/AppContext';
import Spinner from '../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { productId } = useParams(); 
  const navigate = useNavigate();
  
  // ✅ Context se addToCart aur user nikala
  const { addToCart, user } = useFirebase();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Product Fetch Logic
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          toast.error("Product not found");
          navigate("/"); 
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  // ✅ 2. Add to Cart Logic
  const handleAddToCart = () => {
    if (!user) {
      toast.warn("Please Login to add items to cart!", { position: "top-center" });
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success("Item added to Cart 🛒");
  };

  // ✅ 3. Buy Now Logic (Add + Redirect)
  const handleBuyNow = () => {
    if (!user) {
      toast.warn("Please Login to buy!", { position: "top-center" });
      navigate("/login");
      return;
    }
    
    // Pehle cart me add karo
    addToCart(product);
    
    // Fir sidha Checkout page par bhejo
    navigate("/checkout"); 
  };

  if (loading) return <div className="mt-24 flex justify-center"><Spinner /></div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-10 mt-16 min-h-screen">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-[#FF5F1F] flex items-center gap-2 font-medium transition">
        ← Back to Shop
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="md:flex">
          
          {/* Left: Image Section */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
            <img 
              className="w-full max-h-[500px] object-contain mix-blend-multiply hover:scale-105 transition duration-500" 
              src={product.imageUrl} 
              alt={product.title} 
            />
          </div>

          {/* Right: Details Section */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm text-gray-400 font-semibold tracking-wider uppercase mb-2">Product Details</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 capitalize leading-tight">{product.title}</h1>
            
            <div className="text-4xl font-bold text-[#FF5F1F] mb-6">
              ₹{product.price}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description:</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#FF5F1F] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>

              {/* Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                className="flex-1 border-2 border-[#FF5F1F] text-[#FF5F1F] hover:bg-[#FF5F1F] hover:text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now
              </button>
            
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default ProductDetails;