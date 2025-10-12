import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBox, FaRupeeSign, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import TrackUserOrder from "./TrackUserOrder";

const UserOrder = () => {
  const userOrder = useSelector((state) => state.user.myOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseTracking = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {!userOrder || userOrder.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {userOrder.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4 relative">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <FaBox className="text-green-500" /> Order #{order._id}
                </h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full absolute top-0 right-0 ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Preparing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Out for Delivery"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Vendor Products */}
              {order.vendors?.map((vendor, vIdx) => (
                <div
                  key={vIdx}
                  className="mb-4 border p-3 rounded-lg bg-gray-50 shadow-sm"
                >
                  <div className="mb-2 font-semibold text-gray-800">
                    {vendor.vendorName}{" "}
                    <span className="text-sm text-gray-500">
                      ({vendor.vendorEmail} | {vendor.vendorPhone})
                    </span>
                  </div>

                  {vendor.items?.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-gray-700 mb-2"
                    >
                      <div className="flex items-center gap-2">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-gray-500">
                            {p.quantity} {p.unit}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <FaRupeeSign /> {p.price * p.quantity}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end font-bold text-gray-800 mt-2">
                    Subtotal:
                    <span className="flex items-center gap-1 ml-2">
                      <FaRupeeSign /> {vendor.subtotal}
                    </span>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="flex justify-between items-center border-t pt-3 text-gray-800">
                <span className="flex items-center gap-1 font-bold">
                  Total: <FaRupeeSign /> {order.grandTotal}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <FaClock /> {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Show tracking button only if Out for Delivery */}
              {order.status === "Out for Delivery" && (
                <div className="mt-4 flex justify-end">
                  <div
                    onClick={() => handleTrackOrder(order)}
                    className="flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    <FaMapMarkerAlt />
                    Track Order
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for map tracking */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-3xl shadow-lg relative">
            <button
              onClick={handleCloseTracking}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-3">
              Tracking Order #{selectedOrder._id}
            </h3>
            <TrackUserOrder order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
