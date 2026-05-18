import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/AppContext';
import { getOrderListForUser, getProductById, cancelOrder } from '../api/firestoreApi';
import { useNavigate } from 'react-router-dom';
import ProductView from "../components/ProductView";

const statusConfig = {
  paid:      { label: "Paid",      color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  dot: "#3B82F6" },
  delivered: { label: "Delivered", color: "#10B981", bg: "rgba(16,185,129,0.1)",  dot: "#10B981" },
  pending:   { label: "Pending",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  dot: "#F59E0B" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "rgba(239,68,68,0.1)",   dot: "#EF4444" },
};

function StatusBadge({ status }) {
  const s = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}44`,
      borderRadius: "20px", padding: "4px 14px",
      fontSize: "11px", fontWeight: "700",
      fontFamily: "sans-serif", letterSpacing: "0.6px",
      textTransform: "uppercase",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

function OrderCard({ data, index, onViewProduct, onCancelOrder }) {
  const [productImage, setProductImage] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (data?.productId) {
      getProductById(data.productId)
        .then((product) => {
          if (product?.imageUrl) setProductImage(product.imageUrl);
        })
        .catch(console.error);
    }
  }, [data?.productId]);

  const isCancellable = !["cancelled", "delivered"].includes(data?.status?.toLowerCase());

  const handleCancel = async () => {
    const confirmed = window.confirm(`Cancel order for "${data?.productName}"?`);
    if (!confirmed) return;
    setCancelling(true);
    try {
      await onCancelOrder(data?.id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(59,130,246,0.10)",
        border: "1px solid #e0eaff",
        marginBottom: "24px",
        animation: "fadeUp 0.5s ease forwards",
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      {/* Card header */}
      <div style={{
        background: "linear-gradient(to right, #EFF6FF, #FFFBEB)",
        borderBottom: "1px solid #e0eaff",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "linear-gradient(to right, #3B82F6, #F59E0B)",
            color: "white",
            borderRadius: "8px", padding: "4px 12px",
            fontSize: "11px", fontWeight: "700",
            fontFamily: "sans-serif", letterSpacing: "0.6px",
            textTransform: "uppercase",
          }}>
            Order
          </span>
          <span style={{ color: "#94A3B8", fontSize: "13px", fontFamily: "sans-serif" }}>
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
        padding: "24px",
        alignItems: "flex-start",
      }}>
        {/* Product image */}
        <div style={{
          width: "100px", height: "100px", flexShrink: 0,
          borderRadius: "16px", overflow: "hidden",
          background: "linear-gradient(135deg, #EFF6FF, #FFFBEB)",
          border: "1px solid #e0eaff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {productImage ? (
            <img
              src={productImage}
              alt={data?.productName}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }}
            />
          ) : (
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "3px solid #DBEAFE", borderTopColor: "#3B82F6",
              animation: "spin 0.8s linear infinite",
            }} />
          )}
        </div>

        {/* Product info */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <h3 style={{
            margin: "0 0 8px",
            fontSize: "16px", fontWeight: "700",
            color: "#1E3A5F", fontFamily: "Georgia, serif",
            lineHeight: "1.4",
          }}>
            {data?.productName}
          </h3>

          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "8px" }}>
            <span style={{ fontSize: "14px", marginTop: "1px" }}>📍</span>
            <p style={{
              margin: 0, fontSize: "12px",
              color: "#64748B", fontFamily: "sans-serif", lineHeight: "1.6",
            }}>
              {data?.address}
            </p>
          </div>

          <div style={{ marginTop: "8px", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "13px" }}>📞</span>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748B", fontFamily: "sans-serif" }}>
              {data?.phone}
            </p>
          </div>
        </div>

        {/* Price & actions */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "12px",
          minWidth: "130px",
        }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Amount Paid
            </p>
            <p style={{
              margin: "2px 0 0", fontSize: "22px", fontWeight: "800",
              color: "#D97706", fontFamily: "Georgia, serif",
            }}>
              ₹{Number(data?.price || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Payment ID
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94A3B8", fontFamily: "monospace" }}>
              {data?.paymentId?.slice(0, 18)}...
            </p>
          </div>

          {/* View Product */}
          {data?.productId && (
            <button
              onClick={() => onViewProduct(data.productId)}
              style={{
                background: "linear-gradient(to right, #3B82F6, #F59E0B)",
                border: "none",
                color: "white",
                borderRadius: "50px",
                padding: "8px 20px",
                fontSize: "12px", fontWeight: "700",
                fontFamily: "sans-serif",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.3px",
                boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              View Product
            </button>
          )}

          {/* Cancel Order */}
          {isCancellable && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                background: "transparent",
                border: "1.5px solid #EF4444",
                color: "#EF4444",
                borderRadius: "50px",
                padding: "7px 20px",
                fontSize: "12px", fontWeight: "700",
                fontFamily: "sans-serif",
                cursor: cancelling ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.3px",
                opacity: cancelling ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!cancelling) { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "white"; } }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductView, setShowProductView] = useState(false);
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

  const handleViewProduct = async (productId) => {
    try {
      const product = await getProductById(productId);
      setSelectedProduct(product);
      setShowProductView(true);
    } catch (error) {
      console.error("Failed to load product:", error);
    }
  };

  const handleCloseModal = () => {
    setShowProductView(false);
    setSelectedProduct(null);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o)
      );
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Could not cancel the order. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
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

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "36px" }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(to right, #DBEAFE, #FEF3C7)",
            color: "#1E3A5F",
            borderRadius: "20px", padding: "4px 16px",
            fontSize: "12px", fontWeight: "700",
            fontFamily: "sans-serif", letterSpacing: "1.2px",
            textTransform: "uppercase", marginBottom: "12px",
          }}>
            My Account
          </span>
          <h1 style={{
            margin: 0,
            fontSize: "36px", fontWeight: "800",
            color: "#1E3A5F", lineHeight: 1.2,
          }}>
            Order History
          </h1>
          {!fetching && orders.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#64748B", fontFamily: "sans-serif" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          )}
        </div>

        {/* Loading */}
        {fetching && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "4px solid #DBEAFE", borderTopColor: "#3B82F6",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        )}

        {/* Empty state */}
        {!fetching && orders.length === 0 && (
          <div style={{
            textAlign: "center",
            background: "white", borderRadius: "28px",
            border: "1px solid #e0eaff", padding: "64px 32px",
            boxShadow: "0 4px 24px rgba(59,130,246,0.08)",
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛍️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "24px", color: "#1E3A5F", fontFamily: "Georgia, serif" }}>
              No orders yet
            </h2>
            <p style={{ margin: "0 0 28px", color: "#64748B", fontFamily: "sans-serif", fontSize: "14px" }}>
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "linear-gradient(to right, #3B82F6, #F59E0B)",
                border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: "700",
                fontFamily: "sans-serif", borderRadius: "50px",
                padding: "12px 32px", color: "white",
                boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
              }}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders list */}
        {!fetching && orders.map((data, index) => (
          <OrderCard
            key={data.id}
            data={data}
            index={index}
            onViewProduct={handleViewProduct}
            onCancelOrder={handleCancelOrder}
          />
        ))}

      </div>

      {/* ProductView Modal Overlay */}
      {showProductView && selectedProduct && (
        <div
          onClick={handleCloseModal}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(30,58,95,0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "24px 16px",
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: "1100px" }}>
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute", top: "-14px", right: "-14px",
                zIndex: 10,
                background: "white",
                border: "none",
                width: "38px", height: "38px", borderRadius: "50%",
                fontSize: "16px", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#1E3A5F", fontWeight: "bold",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
            >
              ✕
            </button>

            <ProductView product={selectedProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
