// components/ManageStore.jsx
import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/AppContext";
import { getMyStore, getProductsByStoreId, deleteProductFromStore, updateProductInStore } from "../api/firestoreApi";
import AddNewProduct from "./AddNewProduct";
import Popup from "./Popup";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

function ManageStore() {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (user?.uid) {
        const myStore = await getMyStore(user.uid);
        if (myStore) {
          setStore(myStore);
          fetchProducts(myStore.id);
        } else {
          navigate("/AddYourShop");
        }
      }
    };
    if (!loading && user) fetchStore();
  }, [user, loading, navigate]);

  const fetchProducts = async (storeId) => {
    const productsData = await getProductsByStoreId(storeId);
    setProducts(productsData);
  };

  const reloadProducts = async () => {
    if (store?.id) await fetchProducts(store.id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowPopup(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowPopup(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductFromStore(productId);
      reloadProducts();
    }
  };

  // ✅ NEW: Toggle stock status directly from the product card
  const handleToggleStock = async (product) => {
    const updated = { ...product, inStock: !product.inStock };
    await updateProductInStore(product.id, { inStock: updated.inStock });
    // Optimistic UI update — no full reload needed
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updated : p))
    );
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingProduct(null);
  };

  if (loading) return <div className="mt-20 text-center"><Spinner /></div>;

  return (
    <section className="bg-gray-50 min-h-screen mt-20 px-4 mb-10">
      <div className="container mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center gap-6">
          <img src={store?.storeImage} alt="Store" className="w-32 h-32 object-cover rounded-md" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{store?.storeName}</h1>
            <p className="text-gray-600">{store?.storeAddress}, {store?.city}</p>
            <p className="text-sm text-green-600 font-semibold mt-1">Total Products: {products.length}</p>
          </div>
          <button
            onClick={handleAdd}
            className="ml-auto bg-[#FF5F1F] text-white px-6 py-2 rounded-lg hover:scale-105 transition shadow-lg"
          >
            + Add New Product
          </button>
        </div>

        {/* Products List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between ${
                !item.inStock ? "opacity-60" : ""
              }`}
            >
              {/* ✅ NEW: Out of Stock ribbon overlay */}
              <div className="relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-8deg]">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1 truncate">{item.description}</p>
                <span className="text-xl font-bold text-[#FF5F1F] block mt-2">₹{item.price}</span>

                {/* ✅ NEW: Inline stock toggle */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleToggleStock(item)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      item.inStock !== false ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        item.inStock !== false ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-semibold ${item.inStock !== false ? "text-green-600" : "text-red-500"}`}>
                    {item.inStock !== false ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Edit & Delete Buttons */}
              <div className="flex border-t">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-1/2 py-2 text-blue-600 hover:bg-blue-50 font-medium border-r"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-1/2 py-2 text-red-600 hover:bg-red-50 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popup */}
        {showPopup && (
          <Popup onClose={closePopup}>
            <AddNewProduct
              storeId={store.id}
              onClose={closePopup}
              reload={reloadProducts}
              productToEdit={editingProduct}
            />
          </Popup>
        )}
      </div>
    </section>
  );
}

export default ManageStore;
