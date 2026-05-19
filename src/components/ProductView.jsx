import React from 'react';
import { useState } from 'react';
import DisplayRating from './DisplayRating'
import { useFirebase } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify';

function ProductView({ product }) {

  const { addToCart } = useFirebase();

  const [currentImage, setCurrentImage] = useState(0);

  const inStock = product?.inStock !== false; // undefined = in stock (backwards compatible)

  const addProductToCart = (data) => {

    if (!inStock) return;

    if (data?.id) {

      addToCart(data);

      toast.success("Added to cart!", {
        position: toast.POSITION.TOP_LEFT
      });
    }
  };

  const productImages =
    product?.images?.length > 0
      ? product.images
      : [product?.imageUrl];

  return (

    <section
      className="min-h-screen py-10 mt-16"
      style={{ background: "#FEF3C7" }}
    >

      <div className="max-w-7xl mx-auto px-4">

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#FFF8F0",
            border: "1px solid #F5C89A",
            boxShadow: "0 10px 40px rgba(180,83,9,0.10)",
          }}
        >

          <div className="flex flex-col lg:flex-row">

            {/* LEFT IMAGE SECTION */}
            <div
              className="w-full lg:w-1/2 p-4"
              style={{
                background:
                  "linear-gradient(135deg, #FEF3C7, #FFF8F0)",
                borderRight: "1px solid #F5C89A",
              }}
            >

              <div className="sticky top-5">

                {/* Main Image Box */}
                <div
                  className="relative rounded-3xl p-6 h-[500px] flex items-start justify-center overflow-hidden"
                  style={{
                    background: "#FFF8F0",
                    border: "1px solid #F5C89A",
                    boxShadow: "0 6px 24px rgba(180,83,9,0.08)",
                  }}
                >

                  <img
                    src={productImages[currentImage]}
                    alt="product"
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-all duration-500"
                  />

                  {/* Out of Stock overlay */}
                  {!inStock && (

                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-3xl">

                      <span className="bg-red-500 text-white font-bold text-sm px-6 py-2 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>

                    </div>
                  )}

                  {/* Previous Button */}
                  {productImages.length > 1 && (

                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: "#FFF8F0",
                        color: "#7C2D12",
                        border: "1px solid #F5C89A",
                      }}
                    >
                      ←
                    </button>
                  )}

                  {/* Next Button */}
                  {productImages.length > 1 && (

                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: "#FFF8F0",
                        color: "#7C2D12",
                        border: "1px solid #F5C89A",
                      }}
                    >
                      →
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (

                  <div className="flex gap-4 mt-5 overflow-x-auto pb-2">

                    {productImages.map((img, index) => (

                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className="w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300"
                        style={{
                          border:
                            currentImage === index
                              ? "2px solid #B45309"
                              : "2px solid #F5C89A",
                          transform:
                            currentImage === index
                              ? "scale(1.05)"
                              : "scale(1)",
                        }}
                      >

                        <img
                          src={img}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />

                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">

              {/* Badge */}
              <span
                className="inline-block px-4 py-1 text-sm font-semibold rounded-full"
                style={{
                  background: "#FEF3C7",
                  color: "#B45309",
                  border: "1px solid #F5C89A",
                }}
              >
                New Arrival
              </span>

              {/* Title */}
              <h1
                className="mt-5 text-4xl font-bold font-serif leading-tight"
                style={{ color: "#7C2D12" }}
              >
                {product?.title}
              </h1>

              {/* Rating */}
              <div className="mt-4">
                <DisplayRating rating={5} />
              </div>

              {/* Price */}
              <div className="mt-6 flex items-center gap-4">

                <span
                  className="text-4xl font-bold"
                  style={{ color: "#B45309" }}
                >
                  ₹{product?.price}
                </span>

                <span
                  className="text-lg line-through"
                  style={{ color: "#92400E" }}
                >
                  ₹{+product?.price + 500}
                </span>

                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "#FEF3C7",
                    color: "#B45309",
                    border: "1px solid #F5C89A",
                  }}
                >
                  Save 20%
                </span>

              </div>

              {/* Description */}
              <div className="mt-8">

                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: "#7C2D12" }}
                >
                  Product Description
                </h2>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <p
                    className="leading-relaxed text-base"
                    style={{ color: "#92400E" }}
                  >
                    {product?.description}
                  </p>

                </div>
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <p
                    className="font-semibold"
                    style={{ color: "#7C2D12" }}
                  >
                    🚚 Free Shipping
                  </p>

                  <p
                    className="text-sm mt-1"
                    style={{ color: "#92400E" }}
                  >
                    Available all over India
                  </p>

                </div>

                {/* Dynamic stock chip */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: inStock ? "#FFF8F0" : "#FEF2F2",
                    border: inStock
                      ? "1px solid #F5C89A"
                      : "1px solid #FCA5A5",
                  }}
                >

                  <p
                    className="font-semibold"
                    style={{ color: "#7C2D12" }}
                  >
                    {inStock ? "✅ In Stock" : "❌ Out of Stock"}
                  </p>

                  <p
                    className="text-sm mt-1"
                    style={{ color: "#92400E" }}
                  >
                    {inStock
                      ? "Ready for quick delivery"
                      : "Currently unavailable"}
                  </p>

                </div>

              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                {/* Add To Cart */}
                <button
                  onClick={() => addProductToCart(product)}
                  disabled={!inStock}
                  className={`flex-1 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 ${
                    inStock
                      ? "text-white hover:scale-105"
                      : "text-gray-400 bg-gray-200 cursor-not-allowed"
                  }`}
                  style={
                    inStock
                      ? {
                          background:
                            "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                        }
                      : {}
                  }
                >
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </button>

                {/* Buy Now */}
                <button
                  disabled={!inStock}
                  className={`flex-1 py-4 rounded-full border-2 font-semibold text-lg transition-all duration-300 ${
                    !inStock && "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={
                    inStock
                      ? {
                          borderColor: "#B45309",
                          color: "#B45309",
                          background: "#FFF8F0",
                        }
                      : {}
                  }
                >
                  Buy Now
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </section>
  );
}

export default ProductView;