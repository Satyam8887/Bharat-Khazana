import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/AppContext';
import { getOrderListForUser, getProductById } from '../api/firestoreApi';
import { Link, useNavigate } from 'react-router-dom';

const statusConfig = {
  paid:      { label: "Paid",      color: "#00C853", bg: "rgba(0,200,83,0.1)",   dot: "#00C853" },
  delivered: { label: "Delivered", color: "#2979FF", bg: "rgba(41,121,255,0.1)", dot: "#2979FF" },
  pending:   { label: "Pending",   color: "#FFB800", bg: "rgba(255,184,0,0.1)",  dot: "#FFB800" },
  cancelled: { label: "Cancelled", color: "#FF4444", bg: "rgba(255,68,68,0.1)",  dot: "#FF4444" },
};

function StatusBadge({ status }) {
  const s = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}33`,
      borderRadius: "20px", padding: "3px 12px",
      fontSize: "12px", fontWeight: "700",
      fontFamily: "sans-serif", letterSpacing: "0.4px",
      textTransform: "uppercase",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

function OrderCard({ data, index }) {
  const [productImage, setProductImage] = useState(null);

  // ✅ productId se image fetch karo
  useEffect(() => {
    if (data?.productId) {
      getProductById(data.productId)
        .then((product) => {
          if (product?.imageUrl) setProductImage(product.imageUrl);
        })
        .catch(console.error);
    }
  }, [data?.productId]);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid #f0ece8",
        marginBottom: "20px",
        animation: "fadeUp 0.5s ease forwards",
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      {/* Card header */}
      <div style={{
        background: "linear-gradient(135deg, #fff8f5, #fff3ec)",
        borderBottom: "1px solid #f0ece8",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            background: "#FF5F1F", color: "white",
            borderRadius: "8px", padding: "4px 10px",
            fontSize: "11px", fontWeight: "700",
            fontFamily: "sans-serif", letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            Order
          </span>
          <span style={{ color: "#999", fontSize: "13px", fontFamily: "sans-serif" }}>
            {data?.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })
              : data?.time?.date || ""}
          </span>
        </div>
        <StatusBadge status={data?.status} />
      </div>

      {/* Card body */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
        alignItems: "flex-start",
      }}>
        {/* ✅ Product image */}
        <div style={{
          width: "96px", height: "96px", flexShrink: 0,
          borderRadius: "12px", overflow: "hidden",
          background: "#f9f5f2", border: "1px solid #f0ece8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {productImage ? (
            <img
              src={productImage}
              alt={data?.productName}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            />
          ) : (
            // placeholder jab image load ho rahi ho
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "3px solid #f0ece8", borderTopColor: "#FF5F1F",
              animation: "spin 0.8s linear infinite",
            }} />
          )}
        </div>

        {/* Product info */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <h3 style={{
            margin: "0 0 6px",
            fontSize: "15px", fontWeight: "700",
            color: "#1a1a1a", fontFamily: "Georgia, serif",
            lineHeight: "1.4",
          }}>
            {data?.productName}
          </h3>

          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "8px" }}>
            <span style={{ fontSize: "16px", marginTop: "1px" }}>📍</span>
            <p style={{
              margin: 0, fontSize: "12px",
              color: "#888", fontFamily: "sans-serif", lineHeight: "1.6",
            }}>
              {data?.address}
            </p>
          </div>

          <div style={{ marginTop: "8px", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>📞</span>
            <p style={{ margin: 0, fontSize: "12px", color: "#888", fontFamily: "sans-serif" }}>
              {data?.phone}
            </p>
          </div>
        </div>

        {/* Price & actions */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "10px",
          minWidth: "120px",
        }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#bbb", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Amount Paid
            </p>
            <p style={{
              margin: "2px 0 0", fontSize: "20px", fontWeight: "800",
              color: "#FF5F1F", fontFamily: "Georgia, serif",
            }}>
              ₹{Number(data?.price || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#bbb", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Payment ID
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#aaa", fontFamily: "monospace" }}>
              {data?.paymentId?.slice(0, 18)}...
            </p>
          </div>

          {data?.productId && (
            <Link to={`/Shop/product?id=${data?.productId}`}>
              <button
                style={{
                  background: "transparent",
                  border: "1.5px solid #FF5F1F",
                  color: "#FF5F1F",
                  borderRadius: "8px",
                  padding: "7px 16px",
                  fontSize: "12px", fontWeight: "700",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={e => { e.target.style.background = "#FF5F1F"; e.target.style.color = "white"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#FF5F1F"; }}
              >
                View Product
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderHistory() {
  const { user, loading } = useFirebase();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    fetchOrders();
  }, [user, loading]);

  const fetchOrders = async () => {
    if (user && user?.userId) {
      try {
        const res = await getOrderListForUser(user?.userId);
        setOrders(res);
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f6",
      paddingTop: "88px",
      paddingBottom: "48px",
      fontFamily: "Georgia, serif",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 20px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#FF5F1F", fontFamily: "sans-serif", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Bharat Khajana
          </p>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#1a1a1a", lineHeight: 1.2 }}>
            Order History
          </h1>
          {!fetching && orders.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#999", fontFamily: "sans-serif" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          )}
        </div>

        {/* Loading */}
        {fetching && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "3px solid #f0ece8", borderTopColor: "#FF5F1F",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        )}

        {/* Empty state */}
        {!fetching && orders.length === 0 && (
          <div style={{
            textAlign: "center",
            background: "white", borderRadius: "20px",
            border: "1px solid #f0ece8", padding: "64px 32px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛍️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "22px", color: "#1a1a1a" }}>No orders yet</h2>
            <p style={{ margin: "0 0 24px", color: "#999", fontFamily: "sans-serif", fontSize: "14px" }}>
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "#FF5F1F", color: "white",
                border: "none", borderRadius: "10px",
                padding: "12px 28px", fontSize: "14px",
                fontWeight: "700", fontFamily: "sans-serif",
                cursor: "pointer",
              }}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders list */}
        {!fetching && orders.map((data, index) => (
          <OrderCard key={data.id} data={data} index={index} />
        ))}

      </div>
    </div>
  );
}

export default OrderHistory;
