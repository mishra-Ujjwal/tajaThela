import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OTPInput = ({ close, orderId, onSuccess }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/verify-delivery-otp`,
        { orderId, otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        
        toast.success("✅ Delivery marked as completed");
        onSuccess(); // 🔥 Trigger parent to update UI
        setOtp("");
        close();
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message;
      toast.error(message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-5 bg-white shadow-md rounded-xl border mt-6 text-center">
      <h2 className="text-xl font-bold text-green-700 mb-2">
        Delivery Completed
      </h2>
      <p className="text-gray-600 mb-4">
        Enter the 4-digit OTP shared with the customer
      </p>
      <input
        type="text"
        maxLength={4}
        value={otp}
        onChange={handleChange}
        placeholder="Enter OTP"
        className="w-full text-center text-2xl font-bold tracking-widest border rounded-lg py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSubmit}
        className="w-full !bg-green-700 text-white py-2 rounded-lg font-semibold hover:!bg-green-800 transition"
      >
        Confirm Delivery
      </button>
    </div>
  );
};

export default OTPInput;
