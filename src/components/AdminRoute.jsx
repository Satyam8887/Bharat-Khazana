// components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
// ✅ FIXED: Use useFirebase from AppContext (consistent with rest of the app).
// The previous version used useAuth from AuthContext which doesn't exist
// in this project — causing a crash on every admin page load.
import { useFirebase } from "../context/AppContext";
import Spinner from "./Spinner";

const AdminRoute = ({ children }) => {
 
  // not `currentUser` and `loading`.
  const { user, loading } = useFirebase();

  
  // matching the loading UX used everywhere else (AddShop, ManageStore etc.)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Normalize user (same pattern used in AddShop)
  const currentUser = Array.isArray(user) ? user[0] : user;

 
  // Firestore user doc hasn't loaded role yet (treat missing role as non-admin).
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
