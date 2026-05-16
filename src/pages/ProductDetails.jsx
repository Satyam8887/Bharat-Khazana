import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/firestoreApi'; 
import { useFirebase } from '../context/AppContext';
import Spinner from '../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import WhatsAppButton from "../components/WhatsAppButton";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { productId } = useParams(); 
  const navigate = useNavigate();
  
  const { addToCart, user } = useFirebase();

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Product
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

  // ✅ Fetch Shop (Seller)
  useEffect(() => {
    const fetchShop = async () => {
      if (!product?.storeId) return;

      try {
        const docRef = doc(db, "shops", product.storeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShop(docSnap.data());
        } else {
          console.log("Shop not found");
        }
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [product]);

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!user) {
      toast.warn("Please Login first!", { position: "top-center" });
      navigate("/login");
      return;
    }

    addToCart(product);
    toast.success("Added to cart!");
  };

  // ✅ Buy Now
  const handleBuyNow = () => {
    if (!user) {
      toast.warn("Please Login to buy!", { position: "top-center" });
      navigate("/login");
      return;
    }

    addToCart(product);

    navigate("/checkout", {
      state: { product }
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="mt-24 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-10 mt-16 min-h-screen">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500 hover:text-[#FF5F1F] flex items-center gap-2 font-medium transition"
      >
        ← Back to Shop
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="md:flex">

          {/* Image */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
            <img
              className="w-full max-h-[500px] object-cover rounded-lg shadow-md"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">

            <h1 className="text-3xl font-bold mb-4">
              {product.title}
            </h1>

            <div className="text-3xl font-bold text-[#FF5F1F] mb-4">
              ₹{product.price}
            </div>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#FF5F1F] text-white py-3 rounded-lg"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-[#FF5F1F] text-[#FF5F1F] py-3 rounded-lg"
              >
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