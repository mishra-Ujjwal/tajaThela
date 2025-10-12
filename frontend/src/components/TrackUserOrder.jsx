import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Custom Icons
const deliveryIcon = L.icon({
  iconUrl: "/scooter.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const userIcon = L.icon({
  iconUrl: "/home.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const TrackUserOrder = ({ order }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!order?._id) return;

    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/track-user-order/${order._id}`,
          { withCredentials: true }
        );

        const assignment = res.data.assignment;
        if (assignment) {
          setDeliveryLocation({
            lat: assignment.deliveryBoyLat,
            lng: assignment.deliveryBoyLong,
          });
          setUserLocation({
            lat: assignment.userLat,
            lng: assignment.userLong,
          });
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    // Initial fetch
    fetchLocations();

    // Poll every 10 seconds
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [order?._id]);

  if (!deliveryLocation || !userLocation) {
    return <p className="text-gray-600">Fetching live location...</p>;
  }

  const center = [
    (deliveryLocation.lat + userLocation.lat) / 2,
    (deliveryLocation.lng + userLocation.lng) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ height: "350px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
        <Popup>Delivery Partner</Popup>
      </Marker>
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>You</Popup>
      </Marker>
      <Polyline
        positions={[
          [deliveryLocation.lat, deliveryLocation.lng],
          [userLocation.lat, userLocation.lng],
        ]}
        color="blue"
        weight={4}
      />
    </MapContainer>
  );
};

export default TrackUserOrder;
