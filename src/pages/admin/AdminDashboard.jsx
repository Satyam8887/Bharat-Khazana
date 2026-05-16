import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <Link to="/admin/shops">
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Manage Shops
        </button>
      </Link>
    </div>
  );
};

export default AdminDashboard;