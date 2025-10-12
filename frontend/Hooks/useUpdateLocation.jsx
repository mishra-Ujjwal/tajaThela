import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setUserData } from "../redux/userSlice.js";
import { setAddress, setLocation } from "../redux/mapSlice.js";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user.userData);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (positon) => {
      console.log(positon);
      const latitude = positon.coords.latitude;
      const longitude = positon.coords.longitude;
      dispatch(setLocation({lat:latitude,long:longitude}))
      const geolocation = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
          import.meta.env.VITE_GEO_APIFY_API
        }`
      );
      const city = geolocation.data.results[0].formatted || geolocation.data.results[0].city 
      
      // add city in user model
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/updateCity`,
         {city} ,
        { withCredentials: true }
      );
      dispatch(setAddress(city))
    });
  }, [user]);

};

export default useUpdateLocation;
