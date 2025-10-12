import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoyDashboard = () => {
  const user = useSelector((state) => state.user.userData);
  const [assignment, setAssignment] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [recentDelivery, setRecentDelivery] = useState(null);

  // ✅ Fetch assignments + current delivery
  useEffect(() => {
    const getAssignment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/get-assigned-deliveryboys`,
          { withCredentials: true }
        );
        setAssignment(res.data.assignments);

        const currentRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/get-current-delivery`,
          { withCredentials: true }
        );
        const current = currentRes.data.assignment;
        if (current) {
          setCurrentDelivery({
            deliveryBoyLat: current.assignedTo.location.coordinates[1],
            deliveryBoyLong: current.assignedTo.location.coordinates[0],
            userLat: current.order.deliveryAddress.lat,
            userLong: current.order.deliveryAddress.long,
            order: current.order,
            deliveryBoy: current.assignedTo,
            vendor: current.vendor,
            vendorLat: current.vendor.location.coordinates[1],
            vendorLong: current.vendor.location.coordinates[0],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    getAssignment();
  }, []);

  // ✅ Accept delivery
  const acceptButton = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/accept-order`,
        { deliveryAssignmentId: id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Order accepted ");
        setAssignment((prev) => prev.filter((a) => a._id !== id));

        const updatedDelivery = res.data.updatedDelivery;
        const deliveryData = {
          deliveryBoyLat: updatedDelivery.assignedTo.location.coordinates[1],
          deliveryBoyLong: updatedDelivery.assignedTo.location.coordinates[0],
          userLat: updatedDelivery.order.deliveryAddress.lat,
          userLong: updatedDelivery.order.deliveryAddress.long,
          order: updatedDelivery.order,
          deliveryBoy: updatedDelivery.assignedTo,
          vendor: updatedDelivery.vendor,
        };
        setCurrentDelivery(deliveryData);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message;
      toast.error(message);
    }
  };

  // ✅ Callback when OTP is verified successfully
  const handleDeliveryCompleted = (order) => {
    setRecentDelivery({
      id: order._id,
      total: order.grandTotal,
    });
    setCurrentDelivery(null);
  };

  return (
    <section className="p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="text-2xl">
          Welcome!{" "}
          <span className="font-bold">{capitalizeFirstLetter(user?.name)}</span>
        </div>
        <div className="text-sm text-green-800">
          <div>Latitude: {user.location.coordinates[1]}</div>
          <div>Longitude: {user.location.coordinates[0]}</div>
        </div>
      </div>

      {/* Available Deliveries */}
      <div className="px-4 py-2 text-xl font-semibold">Available Deliveries</div>
      <div className="p-3 rounded-lg shadow-lg bg-white flex flex-col gap-3 mb-6 max-h-[400px] overflow-auto">
        {assignment.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No available deliveries right now.
          </div>
        )}
        {assignment.map((item) => (
          <div
            key={item._id}
            className="rounded-lg border border-gray-300 py-3 px-3 shadow-md bg-gray-50 space-y-1"
          >
            <div className="sm:text-lg text-base font-semibold">
              #ORD-{item.order._id}
            </div>
            <h2>
              Customer: <span className="font-bold">{item.order.userId.name}</span>
            </h2>
            <h2>
              Mobile:{" "}
              <span className="font-semibold">{item.order.userId.mobile}</span>
            </h2>
            <h2 className="flex gap-1 items-start">
              <FaLocationDot size={22} className="mt-1 text-red-500" />
              <span>{item.order.deliveryAddress.text}</span>
            </h2>
            <h2>
              Total Payment:{" "}
              <span className="font-semibold">{item.order.grandTotal}</span>
            </h2>
            <h2>
              Mode Of Payment:{" "}
              <span className="font-semibold">{item.order.paymentMethod}</span>
            </h2>

            <button
              onClick={() => acceptButton(item._id)}
              className="w-full text-center py-2 font-semibold text-white !bg-green-700 hover:!bg-green-800 rounded-lg mt-2"
            >
              Accept
            </button>
          </div>
        ))}
      </div>

      {/* Current Delivery Tracking */}
      {currentDelivery && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Current Delivery</h2>
          <DeliveryBoyTracking
            data={currentDelivery}
            onDeliveryComplete={handleDeliveryCompleted}
          />
        </div>
      )}

      {/* ✅ Recent Delivery Summary */}
      {recentDelivery && (
        <div className="mt-6 p-4 rounded-lg bg-green-100 border border-green-300 shadow-md">
          <h2 className="text-xl font-bold text-green-800 mb-2">
            ✅ Recent Delivery Completed
          </h2>
          <div className="text-gray-800">
            <div>Order ID: <span className="font-semibold">{recentDelivery.id}</span></div>
            <div>Total Amount: ₹<span className="font-semibold">{recentDelivery.total}</span></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveryBoyDashboard;
