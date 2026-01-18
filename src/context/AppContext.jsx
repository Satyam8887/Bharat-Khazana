


import React, { useState, useEffect, useContext, createContext } from "react";
import { getLoggedOut } from "../api/authHelper";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const FirebaseContext = createContext(null);

const AppContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Change 1: Shuruat me Cart humesha khali rakhein (Direct localStorage se mat uthao)
  const [cart, setCart] = useState([]); 

  // 🔥 Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            setUser({ 
                uid: currentUser.uid, 
                email: currentUser.email, 
                ...userSnapshot.data() 
            });
          } else {
            setUser({ uid: currentUser.uid, email: currentUser.email });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({ uid: currentUser.uid, email: currentUser.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Change 2: Jab User badle (Login/Logout), tabhi Cart Load ya Clear karo
  useEffect(() => {
    if (user && user.uid) {
      // Agar user hai, to USI USER ka cart nikalo
      const userCart = localStorage.getItem(`cart_${user.uid}`);
      if (userCart) {
        setCart(JSON.parse(userCart));
      } else {
        setCart([]); // Agar naya user hai to cart empty
      }
    } else {
      // Agar user nahi hai (Logout), to Cart Khali kar do
      setCart([]);
    }
  }, [user]); // Ye tab chalega jab 'user' change hoga

  // ✅ Change 3: Jab Cart badle, to usse User ID ke sath Save karo
  useEffect(() => {
    if (user && user.uid) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // ✅ Change 4: Storage Event (Tab sync ke liye)
  useEffect(() => {
    const handleStorageEvent = (event) => {
        if (user && user.uid && event.key === `cart_${user.uid}`) {
            setCart(JSON.parse(event.newValue));
        }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [user]);

  const loggedOut = async () => {
    await getLoggedOut();
    setUser(null);
    setCart([]); // Logout par turant cart clear
  };

  // Helper functions (Same as before)
  const addToCart = (prod) => {
      const existingProduct = cart.find((item) => item.id === prod.id);
      if (existingProduct) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCart((prev) => [...prev, { ...prod, quantity: 1 }]);
      }
  };
  
  const removeProduct = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  
  const incrementProductQuantity = (id) => {
      setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };
  
  const decrementProductQuantity = (id) => {
      setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: (item.quantity > 1 ? item.quantity - 1 : 1) } : item));
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        loggedOut,
        cart,
        addToCart,
        removeProduct,
        clearCart,
        incrementProductQuantity,
        decrementProductQuantity,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

export default AppContext;