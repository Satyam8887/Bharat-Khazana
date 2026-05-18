import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { createOrder } from "../api/firestoreApi";
import { useFirebase } from "../context/AppContext";
import { toast } from "react-toastify";

function Checkout() {

  const location = useLocation();

  const navigate = useNavigate();

  const { user } = useFirebase();

  // ✅ Single product (product page se) ya cart items (cart se)
  const product = location.state?.product;

  const cartItems = location.state?.cartItems;

  const cartTotal = location.state?.total;

  const isCartCheckout = !!cartItems && cartItems.length > 0;

  // ✅ Dono mein se koi ek hona chahiye
  if (!product && !isCartCheckout) {
    return (
      <h2
        className="mt-20 text-center text-xl font-semibold"
        style={{ color: "#7C2D12" }}
      >
        No product found
      </h2>
    );
  }

  // Price calculations
  const displayPrice = isCartCheckout ? cartTotal : product.price;

  const discount = 50;

  const delivery = 20;

  const displayTotal = displayPrice - discount + delivery;

  const [isEditing, setIsEditing] = useState(false);

  const [address, setAddress] = useState("Sultanpur, Uttar Pradesh");

  const [phone, setPhone] = useState("8887500048");

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    if (!address || !phone) {

      toast.warn("Please fill address & phone");

      return;
    }

    setLoading(true);

    try {

      const demoPaymentId = "demo_" + Date.now();

      if (isCartCheckout) {

        // ✅ Cart se aaya — har item ka alag order banao
        for (const item of cartItems) {

          await createOrder({
            userId: user?.userId,
            productId: item.id,
            productName: item.title,
            price: item.price * item.quantity,
            quantity: item.quantity,
            address,
            phone,
            paymentId: demoPaymentId,
            status: "paid",
            createdAt: serverTimestamp(),
          });
        }

      } else {

        // ✅ Single product
        await createOrder({
          userId: user?.userId,
          productId: product.id,
          productName: product.title,
          price: displayTotal,
          address,
          phone,
          paymentId: demoPaymentId,
          status: "paid",
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Payment successful 🎉");

      navigate("/payment-success", {
        replace: true,
        state: {
          paymentId: demoPaymentId,
          productName: isCartCheckout
            ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`
            : product.title,
          amount: displayTotal,
          address,
        },
      });

    } catch (err) {

      console.error(err);

      toast.error("Order failed, try again");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="min-h-screen mt-16 p-4"
      style={{ background: "#FEF3C7" }}
    >

      {/* STEP BAR */}
      <div
        className="p-4 mb-4 flex justify-center gap-10 font-medium rounded-xl"
        style={{
          background: "#FFF8F0",
          border: "1px solid #F5C89A",
        }}
      >

        <span style={{ color: "#B45309" }}>
          1. Address
        </span>

        <span style={{ color: "#B45309" }}>
          2. Order Summary
        </span>

        <span style={{ color: "#92400E" }}>
          3. Payment
        </span>

      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          {/* ADDRESS */}
          <div
            className="p-4 rounded-2xl shadow"
            style={{
              background: "#FFF8F0",
              border: "1px solid #F5C89A",
              boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
            }}
          >

            <div className="flex justify-between items-center">

              <h3
                className="font-bold"
                style={{ color: "#7C2D12" }}
              >
                Deliver to:
              </h3>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="font-semibold"
                style={{ color: "#B45309" }}
              >
                {isEditing ? "Save" : "Change"}
              </button>

            </div>

            {!isEditing ? (

              <>
                <p
                  className="font-semibold mt-2"
                  style={{ color: "#7C2D12" }}
                >
                  Satya
                </p>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  {address}
                </p>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  {phone}
                </p>
              </>

            ) : (

              <div className="mt-3 space-y-2">

                <input
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 rounded outline-none"
                  style={{
                    border: "1px solid #F5C89A",
                    background: "#FEF3C7",
                    color: "#7C2D12",
                  }}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded outline-none"
                  style={{
                    border: "1px solid #F5C89A",
                    background: "#FEF3C7",
                    color: "#7C2D12",
                  }}
                />

              </div>
            )}
          </div>

          {/* ✅ Single product display */}
          {product && (

            <div
              className="p-4 rounded-2xl shadow flex gap-4"
              style={{
                background: "#FFF8F0",
                border: "1px solid #F5C89A",
              }}
            >

              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-28 h-28 object-cover rounded-xl"
                style={{
                  border: "1px solid #F5C89A",
                  background: "#FEF3C7",
                }}
              />

              <div>

                <h2
                  className="font-semibold text-lg"
                  style={{ color: "#7C2D12" }}
                >
                  {product.title}
                </h2>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  Seller: Bharat Store
                </p>

                <div
                  className="mt-2 font-bold"
                  style={{ color: "#B45309" }}
                >
                  ₹{product.price}
                </div>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  Delivery in 2-3 days
                </p>

              </div>
            </div>
          )}

          {/* ✅ Cart items display */}
          {isCartCheckout && cartItems.map((item) => (

            <div
              key={item.id}
              className="p-4 rounded-2xl shadow flex gap-4"
              style={{
                background: "#FFF8F0",
                border: "1px solid #F5C89A",
              }}
            >

              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-28 h-28 object-cover object-scale-down rounded-xl"
                style={{
                  border: "1px solid #F5C89A",
                  background: "#FEF3C7",
                }}
              />

              <div>

                <h2
                  className="font-semibold text-lg"
                  style={{ color: "#7C2D12" }}
                >
                  {item.title}
                </h2>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  Seller: Bharat Store
                </p>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  Qty: {item.quantity}
                </p>

                <div
                  className="mt-2 font-bold"
                  style={{ color: "#B45309" }}
                >
                  ₹{item.price * item.quantity}
                </div>

                <p
                  className="text-sm"
                  style={{ color: "#92400E" }}
                >
                  Delivery in 2-3 days
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Price Details */}
        <div
          className="p-4 rounded-2xl shadow h-fit"
          style={{
            background: "#FFF8F0",
            border: "1px solid #F5C89A",
            boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
          }}
        >

          <h3
            className="font-bold border-b pb-2 mb-2"
            style={{
              color: "#7C2D12",
              borderColor: "#F5C89A",
            }}
          >
            PRICE DETAILS
          </h3>

          <div className="flex justify-between py-1">

            <span style={{ color: "#92400E" }}>
              Price {isCartCheckout && `(${cartItems.length} items)`}
            </span>

            <span style={{ color: "#7C2D12" }}>
              ₹{displayPrice}
            </span>

          </div>

          <div
            className="flex justify-between py-1"
            style={{ color: "#B45309" }}
          >

            <span>Discount</span>

            <span>-₹{discount}</span>

          </div>

          <div className="flex justify-between py-1">

            <span style={{ color: "#92400E" }}>
              Delivery
            </span>

            <span style={{ color: "#7C2D12" }}>
              ₹{delivery}
            </span>

          </div>

          <hr
            className="my-2"
            style={{ borderColor: "#F5C89A" }}
          />

          <div
            className="flex justify-between font-bold text-lg"
            style={{ color: "#7C2D12" }}
          >

            <span>Total</span>

            <span style={{ color: "#B45309" }}>
              ₹{displayTotal}
            </span>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-4 w-full text-white py-2 rounded-xl font-bold transition-all"
            style={{
              background: loading
                ? "#F5C89A"
                : "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Checkout;