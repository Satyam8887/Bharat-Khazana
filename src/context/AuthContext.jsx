import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentUser({
          uid: user.uid,
          ...docSnap.data(),
        });
      } else {
        console.log("No user document found");
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};