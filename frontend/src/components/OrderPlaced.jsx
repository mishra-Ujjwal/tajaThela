import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-orange-50 sm:p-0 px-4 sm:h-[90vh] h-[50vh]">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="sm:text-2xl text-xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed and is being
          processed. You will receive updates shortly.
        </p>

        <button
          onClick={() => navigate("/user-orders")}
          className="!bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:!bg-green-600 transition"
        >
          Back To My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderPlaced;
