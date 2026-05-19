import React from 'react';
import { useFirebase } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductCard({ data }) {
  const { addToCart, user } = useFirebase();
  const navigate = useNavigate();

  const inStock = data?.inStock !== false; // undefined = in stock (backwards compatible)

  const openDetails = () => {
    navigate(`/Shop/product?id=${data.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
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
      className="bg-white border border-[#e0eaff] rounded-3xl shadow cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
      style={{
        boxShadow: "0 4px 20px rgba(59,130,246,0.08)",
        opacity: inStock ? 1 : 0.75,
      }}
    >
      {/* Product Image */}
      <div
        className="h-48 overflow-hidden rounded-t-3xl relative"
        style={{ background: "linear-gradient(135deg, #EFF6FF, #FFFBEB)" }}
      >
        <img
          className="object-contain w-full h-full p-3 transform group-hover:scale-110 transition duration-500"
          src={data.imageUrl || "https://dummyimage.com/400x300"}
          alt={data.title}
        />

        {/* Out of Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-3xl">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h5
            className="text-base font-bold mb-1 truncate"
            style={{ color: "#1E3A5F", fontFamily: "Georgia, serif" }}
          >
            {data.title}
          </h5>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#64748B", fontFamily: "sans-serif" }}>
            {data.description}
          </p>
        </div>

        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: "1px solid #e0eaff" }}
        >
          <span style={{ fontSize: "20px", fontWeight: "800", color: "#D97706", fontFamily: "Georgia, serif" }}>
            ₹{data.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{
              background: inStock ? "linear-gradient(to right, #3B82F6, #F59E0B)" : "#E2E8F0",
              border: "none",
              color: inStock ? "white" : "#94A3B8",
              borderRadius: "50px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: "700",
              fontFamily: "sans-serif",
              cursor: inStock ? "pointer" : "not-allowed",
              boxShadow: inStock ? "0 2px 10px rgba(59,130,246,0.3)" : "none",
              transition: "all 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={e => { if (inStock) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.05)"; } }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {inStock ? "Add +" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
