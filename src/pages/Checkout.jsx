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
  if (!product && !isCartCheckout) return <h2>No product found</h2>;

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
    <div className="bg-gray-100 min-h-screen mt-16 p-4">

      {/* STEP BAR */}
      <div className="bg-white p-4 mb-4 flex justify-center gap-10 font-medium">
        <span className="text-blue-600">1. Address</span>
        <span className="text-blue-600">2. Order Summary</span>
        <span>3. Payment</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="col-span-2 space-y-4">

          {/* ADDRESS */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Deliver to:</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-500 font-semibold"
              >
                {isEditing ? "Save" : "Change"}
              </button>
            </div>

            {!isEditing ? (
              <>
                <p className="font-semibold mt-2">Satya</p>
                <p className="text-gray-600 text-sm">{address}</p>
                <p className="text-gray-600 text-sm">{phone}</p>
              </>
            ) : (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
          </div>

          {/* ✅ Single product display */}
          {product && (
            <div className="bg-white p-4 rounded shadow flex gap-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-28 h-28 object-cover"
              />
              <div>
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-gray-500 text-sm">Seller: Bharat Store</p>
                <div className="mt-2 font-bold text-green-600">₹{product.price}</div>
                <p className="text-sm text-gray-500">Delivery in 2-3 days</p>
              </div>
            </div>
          )}

          {/* ✅ Cart items display */}
          {isCartCheckout && cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow flex gap-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-28 h-28 object-cover object-scale-down"
              />
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-gray-500 text-sm">Seller: Bharat Store</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                <div className="mt-2 font-bold text-green-600">
                  ₹{item.price * item.quantity}
                </div>
                <p className="text-sm text-gray-500">Delivery in 2-3 days</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Price Details */}
        <div className="bg-white p-4 rounded shadow h-fit">
          <h3 className="font-bold border-b pb-2 mb-2">PRICE DETAILS</h3>

          <div className="flex justify-between py-1">
            <span>Price {isCartCheckout && `(${cartItems.length} items)`}</span>
            <span>₹{displayPrice}</span>
          </div>

          <div className="flex justify-between py-1 text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <div className="flex justify-between py-1">
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{displayTotal}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`mt-4 w-full text-white py-2 rounded font-bold transition-all ${
              loading
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
