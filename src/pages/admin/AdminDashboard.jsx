import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FEF3C7] mt-16">

      {/* Hero Section */}
      <div
        className="w-full py-20 px-4"
        style={{
          background: "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
        }}
      >
        <div className="max-w-6xl mx-auto text-center text-white">

          <span
            className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            Bharat Khazana Admin
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-4">
            Admin Dashboard
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Manage local shops, monitor platform activity, and maintain the Bharat Khazana ecosystem.
          </p>

        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Manage Shops Card */}
          <div
            className="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300"
            style={{
              boxShadow: "0 10px 30px rgba(180,83,9,0.12)",
              border: "1px solid #F5C89A",
            }}
          >

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "#FEF3C7",
              }}
            >
              <span className="text-3xl">🏪</span>
            </div>

            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#7C2D12" }}
            >
              Manage Shops
            </h2>

            <p
              className="mb-8 leading-relaxed"
              style={{ color: "#92400E" }}
            >
              View, approve, update, and manage all registered local stores on the platform.
            </p>

            <Link to="/admin/shops">
              <button
                className="text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                }}
              >
                Open Panel
              </button>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;