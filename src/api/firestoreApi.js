// src/api/firestoreApi.js
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  setDoc 
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// ================= USER APIS =================

// ✅ Create New User (Linked with Auth UID)
export const createNewUser = async (userData) => {
  try {
    const userRef = doc(db, "users", userData.userId); 
    
    await setDoc(userRef, {
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      userId: userData.userId,
      storeAdmin: false,
      createdAt: new Date().toISOString()
    });
    
    console.log("User profile created in Firestore!");
  } catch (err) {
    console.error("Error creating user in Firestore:", err);
    throw err;
  }
};

// ✅ Update User to Store Admin
export const updateShopAdminStatus = async (uid) => {
  try {
    const userRef = doc(db, "users", uid); 
    await updateDoc(userRef, {
      storeAdmin: true, 
    });
    console.log("User status updated to Store Admin");
  } catch (error) {
    console.error("Error updating admin status:", error);
    throw error;
  }
};

// ================= STORE APIS =================

// ✅ Create Store
export const createStore = async (storeData) => {
  try {
    const res = await addDoc(collection(db, "stores"), storeData);
    return res;
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

// ✅ Get My Store (For Manage Store Page)
// Ye function specifically logged-in user ki store dhoondhne ke liye hai
export const getMyStore = async (userId) => {
  try {
    const q = query(collection(db, "stores"), where("storeAdmin", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const storeDoc = querySnapshot.docs[0];
      return { id: storeDoc.id, ...storeDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching my store:", error);
    throw error;
  }
};

// ✅ Get Stores by City (Search)
export const getStoreByCity = async (city) => {
  city = city.toLowerCase();
  const storeQuery = query(collection(db, "stores"), where("city", "==", city));

  try {
    const querySnapshot = await getDocs(storeQuery);
    const stores = [];
    querySnapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });
    return stores;
  } catch (error) {
    console.error("Error getting stores by city:", error);
    return [];
  }
};

// ✅ Get Single Store by ID
export const getStoreById = async (id) => {
  const storeDocRef = doc(db, "stores", id);
  try {
    const docSnapshot = await getDoc(storeDocRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      console.log("Store not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting store by ID:", error);
    return null;
  }
};

// ================= PRODUCT APIS =================

// ✅ Add Product
export const addProductInStore = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date().toISOString(),
    });
    console.log("Product added with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// ✅ Get Products by Store ID
export const getProductsByStoreId = async (id) => {
  const productQuery = query(collection(db, "products"), where("storeId", "==", id));

  try {
    const querySnapshot = await getDocs(productQuery);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// ✅ Get Single Product by ID
export const getProductById = async (id) => {
  const productDocRef = doc(db, "products", id);
  try {
    const docSnapshot = await getDoc(productDocRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      console.log("Product not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting product by id:", error);
    return null;
  }
};

// ================= ORDER APIS =================

// ✅ Create Order
export const createOrder = async (orderData) => {
  try {
    const res = await addDoc(collection(db, "orders"), orderData);
    return res;
  } catch (error) {
    console.error("Error creating order:", error);
    return error;
  }
};

// ✅ Get Orders for Store Admin
export const getOrderListForAdmin = async (storeId) => {
  const orderQuery = query(
    collection(db, "orders"), 
    where("storeId", "==", storeId), 
    where("status", "!=", "delivered")
  );

  try {
    const querySnapshot = await getDocs(orderQuery);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }
};

// ✅ Get Orders for User
export const getOrderListForUser = async (userId) => {
  const orderQuery = query(collection(db, "orders"), where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(orderQuery);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (id, newStatus) => {
  const docRef = doc(db, "orders", id);
  try {
    await updateDoc(docRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};
// ✅ Product Update Karna
export const updateProductInStore = async (productId, updatedData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updatedData);
    console.log("Product updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// ✅ Product Delete Karna
export const deleteProductFromStore = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status: "cancelled" });
};

// ✅ Get ALL Stores (Home Page ke liye)
export const getAllStores = async () => {
  try {
    const storesRef = collection(db, "stores");
    const snapshot = await getDocs(storesRef);
    
    const stores = [];
    snapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });
    
    return stores;
  } catch (error) {
    console.error("Error fetching all stores:", error);
    return [];
  }
};