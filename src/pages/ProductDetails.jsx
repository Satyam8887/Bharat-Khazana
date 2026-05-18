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

      toast.warn("Please Login first!", {
        position: "top-center"
      });

      navigate("/login");

      return;
    }

    addToCart(product);

    toast.success("Added to cart!");
  };

  // ✅ Buy Now
  const handleBuyNow = () => {

    if (!user) {

      toast.warn("Please Login to buy!", {
        position: "top-center"
      });

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

      <div
        className="mt-24 flex justify-center min-h-screen"
        style={{ background: "#FEF3C7" }}
      >
        <Spinner />
      </div>
    );
  }

  if (!product) return null;

  return (

    <div
      className="container mx-auto px-4 py-10 mt-16 min-h-screen"
      style={{ background: "#FEF3C7" }}
    >

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-medium transition"
        style={{ color: "#92400E" }}
        onMouseEnter={(e) =>
          e.currentTarget.style.color = "#B45309"
        }
        onMouseLeave={(e) =>
          e.currentTarget.style.color = "#92400E"
        }
      >
        ← Back to Shop
      </button>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "#FFF8F0",
          border: "1px solid #F5C89A",
          boxShadow: "0 8px 24px rgba(180,83,9,0.08)",
        }}
      >

        <div className="md:flex">

          {/* Image */}
          <div
            className="md:w-1/2 p-6 flex items-center justify-center"
            style={{
              background: "#FEF3C7",
              borderRight: "1px solid #F5C89A",
            }}
          >

            <img
              className="w-full max-h-[500px] object-cover rounded-lg"
              style={{
                boxShadow: "0 6px 20px rgba(180,83,9,0.10)",
              }}
              src={product.imageUrl}
              alt={product.title}
            />

          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">

            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "#7C2D12" }}
            >
              {product.title}
            </h1>

            <div
              className="text-3xl font-bold mb-4"
              style={{ color: "#B45309" }}
            >
              ₹{product.price}
            </div>

            <p
              className="mb-6 leading-relaxed"
              style={{ color: "#92400E" }}
            >
              {product.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={handleAddToCart}
                className="flex-1 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: "2px solid #B45309",
                  color: "#B45309",
                  background: "#FEF3C7",
                }}
              >
                Buy Now
              </button>

            </div>

            {/* WhatsApp */}
            <div className="mt-6 flex items-center gap-3">

              <span
                className="text-sm font-medium"
                style={{ color: "#92400E" }}
              >
                Contact Seller:
              </span>

              <WhatsAppButton
                shopPhone={shop?.whatsapp || shop?.mobile}
                product={product}
              />

            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default ProductDetails;