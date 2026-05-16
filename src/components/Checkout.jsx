import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { toast } from "react-toastify";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("Sultanpur, Uttar Pradesh");
  const [phone, setPhone] = useState("8887500048");

  if (!product) return <h2>No product found</h2>;

  // ✅ Razorpay Payment
  const handlePayment = () => {
    if (!address || !phone) {
      toast.warn("Please fill address & phone");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: product.price * 100,
      currency: "INR",
      name: "Bharat Khajana",
      description: product.title,

      handler: async function (response) {
        try {
          await addDoc(collection(db, "orders"), {
            productId: product.id,
            productName: product.title,
            price: product.price,
            address,
            phone,
            paymentId: response.razorpay_payment_id,
            status: "paid",
            createdAt: serverTimestamp(),
          });

          toast.success("Payment successful 🎉");
          navigate("/orders");
        } catch (err) {
          console.error(err);
          toast.error("Order failed");
        }
      },

      theme: {
        color: "#FF5F1F",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

          {/* PRODUCT */}
          <div className="bg-white p-4 rounded shadow flex gap-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-28 h-28 object-cover"
            />

            <div>
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-500 text-sm">Seller: Bharat Store</p>

              <div className="mt-2 font-bold text-green-600">
                ₹{product.price}
              </div>

              <p className="text-sm text-gray-500">
                Delivery in 2-3 days
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded shadow h-fit">
          <h3 className="font-bold border-b pb-2 mb-2">PRICE DETAILS</h3>

          <div className="flex justify-between py-1">
            <span>Price</span>
            <span>₹{product.price}</span>
          </div>

          <div className="flex justify-between py-1 text-green-600">
            <span>Discount</span>
            <span>-₹50</span>
          </div>

          <div className="flex justify-between py-1">
            <span>Delivery</span>
            <span>₹20</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{product.price - 50 + 20}</span>
          </div>

          {/* 🔥 PAYMENT BUTTON */}
          <button
            onClick={handlePayment}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-bold"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;