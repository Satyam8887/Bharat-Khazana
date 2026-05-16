import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.paymentId;
  const productName = location.state?.productName;
  const amount = location.state?.amount;
  const address = location.state?.address;

 
  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
    }
  }, []);

  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!orderId) return; // guard ke baad hi chale
    setTimeout(() => setVisible(true), 100);

    const pieces = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 1.8 + Math.random() * 1.4,
      color: ["#FF5F1F", "#FFB800", "#00C853", "#2979FF", "#E040FB", "#FF4081"][
        Math.floor(Math.random() * 6)
      ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setConfetti(pieces);
  }, []);

  // Guard rendering — navigate effect se pehle blank screen nahi dikhegi
  if (!orderId) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-60px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.4) translateY(40px); opacity: 0; }
          70% { transform: scale(1.08) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes checkDraw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,200,0,0.4); }
          50% { box-shadow: 0 0 0 18px rgba(255,200,0,0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .card-enter { animation: popIn 0.7s cubic-bezier(.22,1,.36,1) forwards; }
        .fade-row { opacity: 0; animation: fadeUp 0.5s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #FFB800 0%, #fff 40%, #FFB800 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "fixed",
            left: `${c.x}%`,
            top: "-20px",
            width: `${c.size}px`,
            height: `${c.size}px`,
            background: c.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
            transform: `rotate(${c.rotation}deg)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Card */}
      <div
        className={visible ? "card-enter" : ""}
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "24px",
          padding: "48px 40px 40px",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Check circle */}
        <div style={{
          width: "88px", height: "88px", borderRadius: "50%",
          background: "linear-gradient(135deg, #00C853, #1DE9B6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          animation: "ringPulse 2s ease-in-out 0.8s infinite",
        }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <polyline
              points="8,22 17,31 34,12"
              stroke="white" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="100" strokeDashoffset="100"
              style={{ animation: "checkDraw 0.6s ease 0.5s forwards" }}
            />
          </svg>
        </div>

        <h1 className="shimmer-text" style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", margin: "0 0 32px", fontFamily: "sans-serif" }}>
          Your order is confirmed and on its way 🎉
        </p>

        {/* Order details */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px", padding: "20px",
          textAlign: "left", marginBottom: "28px",
        }}>
          {[
            { label: "Order ID",           value: orderId,               delay: "0.8s" },
            { label: "Product",            value: productName,           delay: "0.95s" },
            { label: "Amount Paid",        value: `₹${amount}`,         delay: "1.1s", highlight: true },
            { label: "Delivery To",        value: address,               delay: "1.25s" },
            { label: "Estimated Delivery", value: "2–3 Business Days",   delay: "1.4s" },
          ].map(({ label, value, delay, highlight }) => (
            <div key={label} className="fade-row" style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", padding: "8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              animationDelay: delay, gap: "12px",
            }}>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ color: highlight ? "#FFB800" : "rgba(255,255,255,0.9)", fontSize: "13px", fontFamily: "sans-serif", fontWeight: highlight ? "700" : "500", textAlign: "right" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <button
            onClick={() => navigate("/orders", { replace: true })} 
            style={{
              background: "linear-gradient(135deg, #FF5F1F, #FF8C42)",
              color: "white", border: "none", borderRadius: "12px",
              padding: "14px", fontSize: "15px", fontWeight: "700",
              cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.3px",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 4px 20px rgba(255,95,31,0.4)",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(255,95,31,0.55)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(255,95,31,0.4)"; }}
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/", { replace: true })} 
            style={{
              background: "transparent", color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
              padding: "13px", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", fontFamily: "sans-serif",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.target.style.color = "white"; e.target.style.borderColor = "rgba(255,255,255,0.45)"; }}
            onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.6)"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          >
            Continue Shopping
          </button>
        </div>

        <p style={{ marginTop: "20px", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
          A confirmation has been sent to your registered contact.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
