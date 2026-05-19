import React from 'react'
import { useState } from 'react';
import DisplayRating from './DisplayRating'
import { useFirebase } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify';

function ProductView({ product }) {
  const { addToCart } = useFirebase();
  const [currentImage, setCurrentImage] = useState(0);

  const inStock = product?.inStock !== false; // undefined = in stock

  const addProductToCart = (data) => {
    if (!inStock) return;
    if (data?.id) {
      addToCart(data);
      toast.success("Added to cart!", { position: toast.POSITION.TOP_LEFT });
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
        background: "#F8FAFC",
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
        .pv-card { animation: fadeUp 0.5s ease forwards; }
        .pv-nav-btn:hover { background: #EFF6FF !important; box-shadow: 0 4px 16px rgba(59,130,246,0.18) !important; }
        .pv-add-btn:hover { opacity: 0.88; transform: scale(1.03); }
        .pv-buy-btn:hover { background: #3B82F6 !important; color: white !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

        {/* Breadcrumb badge */}
        <div style={{ marginBottom: "20px" }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(to right, #DBEAFE, #FEF3C7)",
            color: "#1E3A5F", borderRadius: "20px", padding: "4px 16px",
            fontSize: "12px", fontWeight: "700", fontFamily: "sans-serif",
            letterSpacing: "1.2px", textTransform: "uppercase",
          }}>
            Product Details
          </span>
        </div>

        {/* Main card */}
        <div className="pv-card" style={{
          background: "white", borderRadius: "28px",
          boxShadow: "0 8px 40px rgba(59,130,246,0.12)",
          border: "1px solid #e0eaff", overflow: "hidden",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>

            {/* LEFT: IMAGE SECTION */}
            <div style={{
              width: "100%", flex: "1 1 420px",
              background: "linear-gradient(135deg, #EFF6FF, #FFFBEB)",
              padding: "32px 24px", borderRight: "1px solid #e0eaff",
            }}>
              <div style={{ position: "sticky", top: "20px" }}>

                {/* Main image */}
                <div style={{
                  position: "relative", background: "white",
                  borderRadius: "24px", boxShadow: "0 4px 24px rgba(59,130,246,0.10)",
                  padding: "24px", height: "460px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", border: "1px solid #e0eaff",
                }}>
                  <img
                    src={productImages[currentImage]}
                    alt="product"
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />

                  {/* Out of Stock overlay on image */}
                  {!inStock && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.45)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "24px",
                    }}>
                      <span style={{
                        background: "#EF4444", color: "white",
                        fontWeight: "700", fontSize: "14px",
                        padding: "8px 24px", borderRadius: "50px",
                        fontFamily: "sans-serif", letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}>
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Prev */}
                  {productImages.length > 1 && (
                    <button className="pv-nav-btn"
                      onClick={() => setCurrentImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                      style={{
                        position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                        background: "white", border: "1px solid #e0eaff", borderRadius: "50%",
                        width: "40px", height: "40px", display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(59,130,246,0.12)",
                        fontSize: "16px", color: "#1E3A5F", transition: "all 0.2s",
                      }}>←</button>
                  )}

                  {/* Next */}
                  {productImages.length > 1 && (
                    <button className="pv-nav-btn"
                      onClick={() => setCurrentImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                      style={{
                        position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                        background: "white", border: "1px solid #e0eaff", borderRadius: "50%",
                        width: "40px", height: "40px", display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(59,130,246,0.12)",
                        fontSize: "16px", color: "#1E3A5F", transition: "all 0.2s",
                      }}>→</button>
                  )}
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px", overflowX: "auto", paddingBottom: "6px" }}>
                    {productImages.map((img, index) => (
                      <button key={index} onClick={() => setCurrentImage(index)} style={{
                        flexShrink: 0, width: "80px", height: "80px",
                        borderRadius: "16px", overflow: "hidden",
                        border: `2px solid ${currentImage === index ? "#3B82F6" : "#e0eaff"}`,
                        transform: currentImage === index ? "scale(1.06)" : "scale(1)",
                        transition: "all 0.2s", cursor: "pointer", padding: 0, background: "white",
                      }}>
                        <img src={img} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: CONTENT SECTION */}
            <div style={{ flex: "1 1 400px", padding: "40px 48px" }}>

              {/* New Arrival badge */}
              <span style={{
                display: "inline-block", background: "#DBEAFE", color: "#1E3A5F",
                borderRadius: "20px", padding: "4px 16px", fontSize: "12px",
                fontWeight: "700", fontFamily: "sans-serif", letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}>
                New Arrival
              </span>

              {/* Title */}
              <h1 style={{
                marginTop: "16px", fontSize: "34px", fontWeight: "800",
                color: "#1E3A5F", fontFamily: "Georgia, serif", lineHeight: "1.25",
              }}>
                {product?.title}
              </h1>

              {/* Rating */}
              <div style={{ marginTop: "14px" }}>
                <DisplayRating rating={5} />
              </div>

              {/* Price */}
              <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "36px", fontWeight: "800", color: "#D97706", fontFamily: "Georgia, serif" }}>
                  ₹{product?.price}
                </span>
                <span style={{ fontSize: "18px", textDecoration: "line-through", color: "#94A3B8", fontFamily: "sans-serif" }}>
                  ₹{+product?.price + 500}
                </span>
                <span style={{
                  background: "rgba(16,185,129,0.1)", color: "#10B981",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "20px", padding: "4px 14px",
                  fontSize: "12px", fontWeight: "700", fontFamily: "sans-serif",
                }}>
                  Save 20%
                </span>
              </div>

              {/* Description */}
              <div style={{ marginTop: "32px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1E3A5F", marginBottom: "12px", fontFamily: "Georgia, serif" }}>
                  Product Description
                </h2>
                <div style={{
                  background: "linear-gradient(to right, #EFF6FF, #FFFBEB)",
                  borderRadius: "16px", padding: "20px 22px", border: "1px solid #e0eaff",
                }}>
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.75", fontSize: "15px", fontFamily: "sans-serif" }}>
                    {product?.description}
                  </p>
                </div>
              </div>

              {/* Feature chips */}
              <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

                <div style={{ background: "#EFF6FF", borderRadius: "16px", padding: "16px", border: "1px solid #DBEAFE" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#1E3A5F", fontFamily: "Georgia, serif", fontSize: "14px" }}>
                    🚚 Free Shipping
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B", fontFamily: "sans-serif" }}>
                    Available all over India
                  </p>
                </div>

                {/* ✅ Dynamic stock chip */}
                <div style={{
                  background: inStock ? "#FFFBEB" : "#FEF2F2",
                  borderRadius: "16px", padding: "16px",
                  border: `1px solid ${inStock ? "#FDE68A" : "#FECACA"}`,
                }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#1E3A5F", fontFamily: "Georgia, serif", fontSize: "14px" }}>
                    {inStock ? "✅ In Stock" : "❌ Out of Stock"}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B", fontFamily: "sans-serif" }}>
                    {inStock ? "Ready for quick delivery" : "Currently unavailable"}
                  </p>
                </div>

              </div>

              {/* CTA Buttons */}
              <div style={{ marginTop: "36px", display: "flex", gap: "16px", flexWrap: "wrap" }}>

                <button
                  className="pv-add-btn"
                  onClick={() => addProductToCart(product)}
                  disabled={!inStock}
                  style={{
                    flex: 1, minWidth: "140px", padding: "16px 24px",
                    borderRadius: "50px", border: "none",
                    background: inStock ? "linear-gradient(to right, #3B82F6, #F59E0B)" : "#E2E8F0",
                    color: inStock ? "white" : "#94A3B8",
                    fontSize: "16px", fontWeight: "700", fontFamily: "sans-serif",
                    cursor: inStock ? "pointer" : "not-allowed",
                    boxShadow: inStock ? "0 4px 20px rgba(59,130,246,0.35)" : "none",
                    transition: "all 0.25s",
                  }}
                >
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </button>

                <button
                  className="pv-buy-btn"
                  disabled={!inStock}
                  style={{
                    flex: 1, minWidth: "140px", padding: "16px 24px",
                    borderRadius: "50px",
                    border: `2px solid ${inStock ? "#3B82F6" : "#E2E8F0"}`,
                    background: "transparent",
                    color: inStock ? "#3B82F6" : "#94A3B8",
                    fontSize: "16px", fontWeight: "700", fontFamily: "sans-serif",
                    cursor: inStock ? "pointer" : "not-allowed",
                    transition: "all 0.25s",
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
