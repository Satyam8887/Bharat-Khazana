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
      className="bg-white rounded-3xl shadow cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
      style={{
        opacity: inStock ? 1 : 0.75,
        border: "1px solid #F5C89A",
        boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
      }}
    >

      {/* Product Image */}
      <div
        className='h-48 overflow-hidden rounded-t-3xl relative'
        style={{
          background: "linear-gradient(135deg, #FEF3C7, #FFF8F0)"
        }}
      >

        <img
          className="object-cover w-full h-full transform group-hover:scale-110 transition duration-500"
          src={data.imageUrl || "https://dummyimage.com/400x300"}
          alt={data.title}
        />

        {/* Out of Stock overlay */}
        {!inStock && (

          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">

            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-8deg]">
              OUT OF STOCK
            </span>

          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">

        <div>

          <h5
            className="text-xl font-semibold mb-2 truncate transition-colors"
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
            }}
          >
            {data.description}
          </p>

        </div>

        <div
          className="flex items-center justify-between mt-auto pt-4"
          style={{
            borderTop: "1px solid #F5C89A",
          }}
        >

          <span
            className="text-xl font-bold"
            style={{
              color: "#B45309",
              fontFamily: "Georgia, serif",
            }}
          >
            ₹{data.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`font-medium rounded-full text-sm px-5 py-2 transition shadow-md z-10 ${
              inStock
                ? "text-white"
                : "cursor-not-allowed"
            }`}
            style={
              inStock
                ? {
                    background:
                      "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                    boxShadow: "0 2px 10px rgba(180,83,9,0.25)",
                  }
                : {
                    background: "#FEF3C7",
                    color: "#92400E",
                    border: "1px solid #F5C89A",
                  }
            }
          >
            {inStock ? "Add +" : "Unavailable"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;