import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const useGetVendorProduct = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fetchProduct = async (req, res) => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendor/product`, {
          withCredentials: true,
        });


      } catch (err) {
        console.log(err)
      }
    };
    fetchProduct();
  }, []);
};

export default useGetVendorProduct;
