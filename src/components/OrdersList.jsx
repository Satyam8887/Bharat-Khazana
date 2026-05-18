import React, { useEffect, useState } from "react";
import { getOrderListForAdmin } from "../api/firestoreApi";
import Status from "./Status";

import {
  FaMapMarkerAlt,
  FaTimesCircle,
  FaBoxOpen,
} from "react-icons/fa";

function OrdersList({ id, flag }) {

  const [orders, setOrders] = useState([]);

  const [cancelPopup, setCancelPopup] = useState(false);

  const [cancelReason, setCancelReason] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [id, flag]);

  const fetchOrders = async () => {
    try {

      const res = await getOrderListForAdmin(id);

      setOrders(res);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async () => {

    try {

      await updateOrderStatus(selectedOrder?.id, {
        status: "Cancelled",
        cancelReason: cancelReason,
      });

      setCancelPopup(false);

      setCancelReason("");

      setSelectedOrder(null);

      fetchOrders();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">

      {orders &&
        orders.length !== 0 &&
        orders.map((data) => (

          <div key={data.id} className="w-full">

            {/* Date Header */}
            <div
              className="my-5 py-3 px-5 rounded-2xl text-white font-semibold shadow-md"
              style={{
                background:
                  "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
              }}
            >
              <p className="text-base">
                {data?.time?.date} ({data?.time?.time})
              </p>
            </div>

            {/* Order Card */}
            <div
              className="flex flex-col md:flex-row items-start justify-between rounded-3xl p-5 gap-6 hover:shadow-2xl transition-all duration-300"
              style={{
                background: "#FFF8F0",
                border: "1px solid #F5C89A",
                boxShadow: "0 8px 24px rgba(180,83,9,0.08)",
              }}
            >

              {/* LEFT SIDE */}
              <div className="w-full md:w-[40%] flex gap-5">

                {/* Image */}
                <div
                  className="w-[120px] h-[120px] rounded-2xl overflow-hidden"
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <img
                    className="w-full h-full object-contain"
                    src={data?.productDetails?.imageUrl}
                    alt="product"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">

                  <h3
                    className="text-xl font-bold font-serif"
                    style={{ color: "#7C2D12" }}
                  >
                    {data?.productDetails?.title}
                  </h3>

                  <p
                    className="mt-2"
                    style={{ color: "#92400E" }}
                  >
                    Price ₹{data?.productDetails?.price}
                  </p>

                  {/* Address */}
                  <div className="mt-5">

                    <p
                      className="font-semibold mb-2"
                      style={{ color: "#7C2D12" }}
                    >
                      Shipping Address
                    </p>

                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#92400E" }}
                    >
                      {data?.address?.name},
                      Mobile - {data?.address?.mobile},
                      {data?.address?.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="w-full md:w-[45%] flex flex-col gap-5">

                {/* Status */}
                <div className="flex items-center justify-between">

                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#7C2D12" }}
                  >
                    Status:
                    <span
                      className="ml-2"
                      style={{ color: "#92400E" }}
                    >
                      {data?.status}
                    </span>
                  </p>

                  <Status
                    id={data?.id}
                    fetchOrders={fetchOrders}
                  />
                </div>

                {/* Quantity + Total */}
                <div className="flex items-center justify-between">

                  <p
                    className="font-medium"
                    style={{ color: "#92400E" }}
                  >
                    Quantity:
                    <span className="ml-2">
                      {data?.productDetails?.quantity}
                    </span>
                  </p>

                  <p
                    className="text-xl font-bold"
                    style={{ color: "#B45309" }}
                  >
                    ₹
                    {data?.productDetails?.quantity *
                      data?.productDetails?.price}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">

                  {/* Geo Location */}
                  <a
                    href={`https://www.google.com/maps/search/${data?.address?.geoLocation?.latitude},+${data?.address?.geoLocation?.longitude}/@${data?.address?.geoLocation?.latitude},${data?.address?.geoLocation?.longitude},13z?entry=ttu`}
                    target="blank"
                  >
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full text-white font-medium hover:scale-105 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                      }}
                    >
                      <FaMapMarkerAlt />
                      Geo Location
                    </button>
                  </a>

                  {/* Cancel */}
                  {data?.status !== "Cancelled" && (
                    <button
                      onClick={() => {
                        setSelectedOrder(data);
                        setCancelPopup(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300"
                    >
                      <FaTimesCircle />
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* Cancel Reason */}
                {data?.cancelReason && (
                  <div
                    className="border rounded-2xl p-4"
                    style={{
                      background: "#FFF1F2",
                      borderColor: "#FCA5A5",
                    }}
                  >

                    <p className="font-semibold text-red-600 mb-1">
                      Cancellation Reason
                    </p>

                    <p className="text-sm text-red-500">
                      {data?.cancelReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

      {/* ================= POPUP ================= */}

      {cancelPopup && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div
            className="rounded-3xl shadow-2xl w-[90%] max-w-md p-6"
            style={{
              background: "#FFF8F0",
              border: "1px solid #F5C89A",
            }}
          >

            <h2
              className="text-2xl font-bold mb-4 font-serif"
              style={{ color: "#7C2D12" }}
            >
              Cancel Order
            </h2>

            <textarea
              value={cancelReason}
              onChange={(e) =>
                setCancelReason(e.target.value)
              }
              placeholder="Write cancellation reason..."
              className="w-full rounded-2xl p-4 outline-none min-h-[120px]"
              style={{
                border: "1px solid #F5C89A",
                background: "#FEF3C7",
                color: "#7C2D12",
              }}
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => {
                  setCancelPopup(false);
                  setCancelReason("");
                }}
                className="px-5 py-2 rounded-full"
                style={{
                  background: "#FEF3C7",
                  color: "#7C2D12",
                  border: "1px solid #F5C89A",
                }}
              >
                Close
              </button>

              <button
                onClick={handleCancelOrder}
                className="px-5 py-2 rounded-full text-white font-semibold"
                style={{
                  background:
                    "linear-gradient(to right, #EF4444, #DC2626)",
                }}
              >
                Confirm Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersList;