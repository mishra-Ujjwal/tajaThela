import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import OTPInput from "./OTPInput";
import axios from "axios";

const deliveryIcon = new L.Icon({
  iconUrl: "/scooter.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: "/home.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const shopIcon = new L.Icon({
  iconUrl: "/shop.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data, onDeliveryComplete }) => {
  const [openOtpBox, setOpenOtpBox] = useState(false);

  if (!data) return null;

  const {
    vendorLat,
    vendorLong,
    deliveryBoyLat,
    deliveryBoyLong,
    userLat,
    userLong,
    order,
    vendor,
    deliveryBoy,
  } = data;

 const center = [
  (deliveryBoyLat + userLat) / 2,
  (deliveryBoyLong + userLong) / 2,
];

  const path = [
    [deliveryBoyLat, deliveryBoyLong],
    [userLat, userLong],
  ];

  const handleOtpButton = async (id) => {
    setOpenOtpBox(true);
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/generate-otp/${id}`,
      { withCredentials: true }
    );
    console.log(res.data)
  };

  return (
    <div className="w-full mt-3 rounded-xl shadow-md overflow-hidden bg-green-50 border border-green-200">
      <div className="mt-3 mb-2 px-2 flex flex-col gap-2 text-blue-600 font-semibold">
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${deliveryBoyLat},${deliveryBoyLong}&destination=${vendorLat},${vendorLong}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          🚀 Navigate to Vendor
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${vendorLat},${vendorLong}&destination=${userLat},${userLong}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          🚚 Navigate to Customer
        </a>
      </div>

      <div className="w-full h-[300px]">
        <MapContainer center={center} zoom={17} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[deliveryBoyLat, deliveryBoyLong]} icon={deliveryIcon}>
            <Popup>Delivery Boy</Popup>
          </Marker>
          <Marker position={[userLat, userLong]} icon={customerIcon} />
          <Polyline positions={path} color="blue" weight={4} />
        </MapContainer>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-green-900">
          🚚 Current Delivery
        </h2>
        <div className="space-y-1 text-gray-800">
          <div>Order ID: {order._id}</div>
          <div className="mt-2 font-semibold">Customer Details</div>
          <div>Name: {order.userId.name}</div>
          <div>Mobile: {order.userId.mobile}</div>

          <div className="mt-2 font-semibold">Vendor Details</div>
          <div>Vendor: {vendor?.name || "N/A"}</div>
          <div>Mobile: {vendor?.mobile || "N/A"}</div>

          <div className="mt-2 font-semibold">Payment</div>
          <div>Total: ₹{order.grandTotal}</div>
          <div>Mode: {order.paymentMethod}</div>
        </div>

        <div
          className="flex mt-3 items-center justify-center py-2 bg-green-800 font-semibold text-xl rounded-lg text-white cursor-pointer"
          onClick={() => handleOtpButton(order._id)}
        >
          Delivered
        </div>

        {openOtpBox && (
          <OTPInput
            close={() => setOpenOtpBox(false)}
            orderId={order._id}
            onSuccess={() => onDeliveryComplete(order)}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyTracking;
