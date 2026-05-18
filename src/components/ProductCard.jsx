import React from 'react';
import { useFirebase } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductCard({ data }) {
  const { addToCart, user } = useFirebase();
  const navigate = useNavigate();

  // Navigate to ProductView page
  const openDetails = () => {
    navigate(`/Shop/product?id=${data.id}`);
  };

  // Add to Cart
  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!user) {
      toast.warn("Please Login to add items!");
      navigate("/login");
      return;
    }

    addToCart(data);
    toast.success("Added to Cart");
  };

  return (
    <div
      onClick={openDetails}
      className="bg-white rounded-3xl shadow cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
      style={{
        border: "1px solid #F5C89A",
        boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
      }}
    >

      {/* Product Image */}
      <div
        className="h-48 overflow-hidden rounded-t-3xl relative"
        style={{
          background: "linear-gradient(135deg, #FEF3C7, #FFF8F0)",
        }}
      >

        <img
          className="object-contain w-full h-full p-3 transform group-hover:scale-110 transition duration-500"
          src={data.imageUrl || "https://dummyimage.com/400x300"}
          alt={data.title}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">

        <div>

          <h5
            className="text-base font-bold mb-1 truncate transition-colors"
            style={{
              color: "#7C2D12",
              fontFamily: "Georgia, serif",
            }}
          >
            {data.title}
          </h5>

          <p
            className="text-sm mb-3 line-clamp-2"
            style={{
              color: "#92400E",
              fontFamily: "sans-serif",
            }}
          >
            {data.description}
          </p>

        </div>

        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{
            borderTop: "1px solid #F5C89A",
          }}
        >

          <span
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#B45309",
              fontFamily: "Georgia, serif",
            }}
          >
            ₹{data.price}
          </span>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            style={{
              background:
                "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              border: "none",
              color: "white",
              borderRadius: "50px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: "700",
              fontFamily: "sans-serif",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(180,83,9,0.25)",
              transition: "all 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Add +
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;