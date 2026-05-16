import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null); // 🔥 Modal state

  // 📦 Fetch all shops
  const fetchShops = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "stores")); // change if your collection name is different
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "stores", id), {
        status: status,
      });
      fetchShops();
      setSelectedShop(null); // close modal after action
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading shops...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shop Verification</h1>

      {shops.length === 0 ? (
        <p>No shops found.</p>
      ) : (
        shops.map((shop) => (
          <div key={shop.id} className="border p-4 mb-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{shop.storeName || shop.name}</h2>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="font-medium">
                {shop.status || "pending"}
              </span>
            </p>

            <div className="mt-3 flex gap-2 flex-wrap">
              
              {/* 👁️ View Details */}
              <button
                onClick={() => setSelectedShop(shop)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View Details
              </button>

              {/* ✅ Approve */}
              <button
                onClick={() => updateStatus(shop.id, "approved")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              {/* ❌ Reject */}
              <button
                onClick={() => updateStatus(shop.id, "rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {/* 🔥 MODAL */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px] shadow-lg">
            
            <h2 className="text-xl font-bold mb-4">Shop Details</h2>

            <p><strong>Name:</strong> {selectedShop.storeName || selectedShop.name}</p>
            <p><strong>Status:</strong> {selectedShop.status || "pending"}</p>

            {selectedShop.storeAddress && (
              <p><strong>Address:</strong> {selectedShop.storeAddress}</p>
            )}

            {selectedShop.city && (
              <p><strong>City:</strong> {selectedShop.city}</p>
            )}

            {selectedShop.mobile && (
              <p><strong>Mobile:</strong> {selectedShop.mobile}</p>
            )}

            {selectedShop.ownerId && (
              <p><strong>Owner ID:</strong> {selectedShop.ownerId}</p>
            )}

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-2 flex-wrap">
              
              <button
                onClick={() => updateStatus(selectedShop.id, "approved")}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(selectedShop.id, "rejected")}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => setSelectedShop(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShops;