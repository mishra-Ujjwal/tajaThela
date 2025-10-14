import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaRupeeSign, FaClock } from "react-icons/fa";
import { useSelector } from "react-redux";

const OwnerOrder = () => {
  const vendorOrders = useSelector((state) => state.user.vendorOrders);
  const [orders, setOrders] = useState([]);
  const [availableBoys, setAvailableBoys] = useState([]);

  // ✅ Sync vendorOrders from Redux to local state
  useEffect(() => {
    if (vendorOrders && vendorOrders.length > 0) {
      setOrders(vendorOrders);
    }
  }, [vendorOrders]); // runs whenever vendorOrders changes

  const handleStatusChange = async (orderId, vendorId, newStatus) => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/update-status/${vendorId}/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      console.log("✅ Status Updated:", res.data);

      if (res.data.availableBoys) {
        setAvailableBoys(res.data.availableBoys);
      }

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId ? { ...o, status: res.data.order.status } : o
        )
      );
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      alert("Failed to update order status. Check server logs.");
    }
  };
  console.log(orders);

  return (
    <div className="min-h-screen  pt-4 px-4">
      <h2 className="text-2xl font-bold mb-6">Orders For You</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders containing your products yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-3 py-4 border"
            >
              <div className="flex justify-between items-center mb-4 relative">
                <h2 className="font-semibold text-md flex items-center gap-2">
                  <FaBox className="text-green-500" /> Order <br /> #{order._id}
                </h2>

                {order.status === "delivered" ? (
                  <span className="text-green-600 font-semibold absolute top-0 right-0">
                    Delivered ✅
                  </span>
                ) : (
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        order.vendorId,
                        e.target.value
                      )
                    }
                    className="border absolute top-0 right-0 px-2 py-1 rounded text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                  </select>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  Your Products
                </h3>
                {order.vendorProducts?.map((p) => (
                  <div
                    key={p._id}
                    className="flex justify-between text-gray-700 mb-1"
                  >
                    <span>
                      {p.name} ({p.quantity} {p.unit})
                    </span>
                    <span className="flex items-center gap-0.5">
                      <FaRupeeSign /> {p.price * p.quantity}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between font-semibold text-gray-800 mt-2">
                  <span>Subtotal:</span>
                  <span className="flex items-center gap-0.5">
                    <FaRupeeSign /> {order.subtotal}
                  </span>
                </div>

                <hr className="my-2" />

                <div className="text-sm text-gray-600">
                  <strong>Delivery Address:</strong>{" "}
                  {order.deliveryAddress?.text || "N/A"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod || "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 text-gray-800">
                <span className="flex items-center gap-1 font-bold">
                  <FaRupeeSign /> {order.subtotal}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <FaClock /> {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {order.status === "Out for Delivery" && (
  <div className="mt-6 bg-gray-50 border rounded p-4">
    {order.assignment ? (
      <>
        <h3 className="font-semibold mb-2 text-green-600">
          Assigned Delivery Boy
        </h3>
        <div className="flex justify-between text-sm py-1">
          <span>{order.assignDeliveryBoy?.name || "N/A"}</span>
          <span>{order.assignDeliveryBoy?.mobile || "N/A"}</span>
        </div>
      </>
    ) : availableBoys.length > 0 ? (
      <>
        <h3 className="font-semibold mb-2 text-green-600">
          Select a Delivery Boy
        </h3>
        <div className="space-y-2">
          {availableBoys.map((boy) => (
            <div
              key={boy._id}
              className="flex justify-between items-center bg-white p-2 rounded border"
            >
              <div>
                <p className="font-medium">{boy.name}</p>
                <p className="text-sm text-gray-500">{boy.mobile}</p>
              </div>
              
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="text-gray-600 italic">
        Waiting for delivery boy to accept the order...
      </div>
    )}
  </div>
)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerOrder;
