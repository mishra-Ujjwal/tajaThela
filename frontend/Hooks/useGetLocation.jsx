import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setUserData } from "../redux/userSlice.js";
import { setAddress, setLocation } from "../redux/mapSlice.js";

const useGetLocation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const getCurrentLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;

          // ✅ Update Redux immediately
          dispatch(setLocation({ lat, long }));

          // ✅ Send coordinates to backend (optional)
          try {
            const result = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/updateLocation`,
              { lat, long },
              { withCredentials: true }
            );
            console.log("Location updated:", result.data);
          } catch (err) {
            console.error("Failed to update location:", err);
          }

          // ✅ Fetch address asynchronously
          try {
            const geoRes = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${import.meta.env.VITE_GEO_APIFY_API}`
            );
            const city =
              geoRes.data.results[0].formatted ||
              geoRes.data.results[0].city ||
              "";
            dispatch(setAddress(city));
          } catch (err) {
            console.error("Failed to get address:", err);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    };

    getCurrentLocation();
  }, [user]);
};

export default useGetLocation;
