import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {  setUserOrders, setVendorOrders } from "../redux/userSlice.js";

const useGetOrder = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fethOrder = async (req, res) => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/orders`, {
          withCredentials: true,
        });

        dispatch(setUserOrders(result.data.orders))
        const vendorResult = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/vendor-orders`, {
          withCredentials: true,
        });

        dispatch(setVendorOrders(vendorResult.data.orders))
      } catch (err) {
        console.log(err)
      }
    };
    fethOrder();
  });
};

export default useGetOrder;
