import React from 'react'
import { useState } from 'react';
import DisplayRating from './DisplayRating'
import { useFirebase } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify';

function ProductView({ product }) {

  const { addToCart } = useFirebase();

  const [currentImage, setCurrentImage] = useState(0);

  const addProductToCart = (data) => {

    if (data?.id) {

      addToCart(data);

      toast.success("Added to cart!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const productImages =
    product?.images?.length > 0
      ? product.images
      : [product?.imageUrl];

  return (

    <section
      style={{
        minHeight: "100vh",
        background: "#FEF3C7",
        paddingTop: "80px",
        paddingBottom: "48px",
        fontFamily: "Georgia, serif",
      }}
    >

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pv-card {
          animation: fadeUp 0.5s ease forwards;
        }

        .pv-thumb:hover {
          border-color: #B45309 !important;
          transform: scale(1.06);
        }

        .pv-nav-btn:hover {
          background: #FEF3C7 !important;
          box-shadow: 0 4px 16px rgba(180,83,9,0.18) !important;
        }

        .pv-add-btn:hover {
          opacity: 0.88;
          transform: scale(1.03);
        }

        .pv-buy-btn:hover {
          background: #B45309 !important;
          color: white !important;
        }
      `}</style>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}
      >

        {/* Breadcrumb badge */}
        <div style={{ marginBottom: "20px" }}>

          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(to right, #FEF3C7, #FFF8F0)",
              color: "#7C2D12",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "sans-serif",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              border: "1px solid #F5C89A",
            }}
          >
            Product Details
          </span>

        </div>

        {/* Main card */}
        <div
          className="pv-card"
          style={{
            background: "#FFF8F0",
            borderRadius: "28px",
            boxShadow: "0 8px 40px rgba(180,83,9,0.12)",
            border: "1px solid #F5C89A",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >

            {/* ── LEFT: IMAGE SECTION ── */}
            <div
              style={{
                width: "100%",
                flex: "1 1 420px",
                background:
                  "linear-gradient(135deg, #FEF3C7, #FFF8F0)",
                padding: "32px 24px",
                borderRight: "1px solid #F5C89A",
              }}
            >

              <div style={{ position: "sticky", top: "20px" }}>

                {/* Main image box */}
                <div
                  style={{
                    position: "relative",
                    background: "#FFF8F0",
                    borderRadius: "24px",
                    boxShadow: "0 4px 24px rgba(180,83,9,0.10)",
                    padding: "24px",
                    height: "460px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <img
                    src={productImages[currentImage]}
                    alt="product"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={e =>
                      e.currentTarget.style.transform = "scale(1.05)"
                    }
                    onMouseLeave={e =>
                      e.currentTarget.style.transform = "scale(1)"
                    }
                  />

                  {/* Prev button */}
                  {productImages.length > 1 && (

                    <button
                      className="pv-nav-btn"
                      onClick={() =>
                        setCurrentImage(prev =>
                          prev === 0
                            ? productImages.length - 1
                            : prev - 1
                        )
                      }
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#FFF8F0",
                        border: "1px solid #F5C89A",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(180,83,9,0.12)",
                        fontSize: "16px",
                        color: "#7C2D12",
                        transition: "all 0.2s",
                      }}
                    >
                      ←
                    </button>
                  )}

                  {/* Next button */}
                  {productImages.length > 1 && (

                    <button
                      className="pv-nav-btn"
                      onClick={() =>
                        setCurrentImage(prev =>
                          prev === productImages.length - 1
                            ? 0
                            : prev + 1
                        )
                      }
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#FFF8F0",
                        border: "1px solid #F5C89A",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(180,83,9,0.12)",
                        fontSize: "16px",
                        color: "#7C2D12",
                        transition: "all 0.2s",
                      }}
                    >
                      →
                    </button>
                  )}

                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "20px",
                      overflowX: "auto",
                      paddingBottom: "6px",
                    }}
                  >

                    {productImages.map((img, index) => (

                      <button
                        key={index}
                        className="pv-thumb"
                        onClick={() => setCurrentImage(index)}
                        style={{
                          flexShrink: 0,
                          width: "80px",
                          height: "80px",
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: `2px solid ${
                            currentImage === index
                              ? "#B45309"
                              : "#F5C89A"
                          }`,
                          transform:
                            currentImage === index
                              ? "scale(1.06)"
                              : "scale(1)",
                          transition: "all 0.2s",
                          cursor: "pointer",
                          padding: 0,
                          background: "#FFF8F0",
                        }}
                      >

                        <img
                          src={img}
                          alt="thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />

                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: CONTENT SECTION ── */}
            <div
              style={{
                flex: "1 1 400px",
                padding: "40px 48px",
              }}
            >

              {/* New Arrival badge */}
              <span
                style={{
                  display: "inline-block",
                  background: "#FEF3C7",
                  color: "#7C2D12",
                  borderRadius: "20px",
                  padding: "4px 16px",
                  fontSize: "12px",
                  fontWeight: "700",
                  fontFamily: "sans-serif",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  border: "1px solid #F5C89A",
                }}
              >
                New Arrival
              </span>

              {/* Title */}
              <h1
                style={{
                  marginTop: "16px",
                  fontSize: "34px",
                  fontWeight: "800",
                  color: "#7C2D12",
                  fontFamily: "Georgia, serif",
                  lineHeight: "1.25",
                }}
              >
                {product?.title}
              </h1>

              {/* Rating */}
              <div style={{ marginTop: "14px" }}>
                <DisplayRating rating={5} />
              </div>

              {/* Price row */}
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >

                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: "800",
                    color: "#B45309",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  ₹{product?.price}
                </span>

                <span
                  style={{
                    fontSize: "18px",
                    textDecoration: "line-through",
                    color: "#92400E",
                    fontFamily: "sans-serif",
                  }}
                >
                  ₹{+product?.price + 500}
                </span>

                <span
                  style={{
                    background: "rgba(180,83,9,0.10)",
                    color: "#B45309",
                    border: "1px solid rgba(180,83,9,0.25)",
                    borderRadius: "20px",
                    padding: "4px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    fontFamily: "sans-serif",
                  }}
                >
                  Save 20%
                </span>

              </div>

              {/* Description */}
              <div style={{ marginTop: "32px" }}>

                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#7C2D12",
                    marginBottom: "12px",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Product Description
                </h2>

                <div
                  style={{
                    background:
                      "linear-gradient(to right, #FEF3C7, #FFF8F0)",
                    borderRadius: "16px",
                    padding: "20px 22px",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <p
                    style={{
                      margin: 0,
                      color: "#92400E",
                      lineHeight: "1.75",
                      fontSize: "15px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {product?.description}
                  </p>

                </div>
              </div>

              {/* Feature chips */}
              <div
                style={{
                  marginTop: "28px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >

                <div
                  style={{
                    background: "#FEF3C7",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <p
                    style={{
                      margin: "0 0 4px",
                      fontWeight: "700",
                      color: "#7C2D12",
                      fontFamily: "Georgia, serif",
                      fontSize: "14px",
                    }}
                  >
                    🚚 Free Shipping
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#92400E",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Available all over India
                  </p>

                </div>

                <div
                  style={{
                    background: "#FFF8F0",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <p
                    style={{
                      margin: "0 0 4px",
                      fontWeight: "700",
                      color: "#7C2D12",
                      fontFamily: "Georgia, serif",
                      fontSize: "14px",
                    }}
                  >
                    ✅ In Stock
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#92400E",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Ready for quick delivery
                  </p>

                </div>
              </div>

              {/* CTA Buttons */}
              <div
                style={{
                  marginTop: "36px",
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >

                {/* Add to Cart */}
                <button
                  className="pv-add-btn"
                  onClick={() => addProductToCart(product)}
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    padding: "16px 24px",
                    borderRadius: "50px",
                    border: "none",
                    background:
                      "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    fontFamily: "sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(180,83,9,0.35)",
                    transition: "all 0.25s",
                    letterSpacing: "0.3px",
                  }}
                >
                  Add to Cart
                </button>

                {/* Buy Now */}
                <button
                  className="pv-buy-btn"
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    padding: "16px 24px",
                    borderRadius: "50px",
                    border: "2px solid #B45309",
                    background: "transparent",
                    color: "#B45309",
                    fontSize: "16px",
                    fontWeight: "700",
                    fontFamily: "sans-serif",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    letterSpacing: "0.3px",
                  }}
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