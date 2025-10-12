import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {  setVendors } from "../redux/vendorSlice.js";

const useGetAllVendor = () => {
  const vendor = useSelector((state) => state.vendor.vendorData);
  console.log(vendor)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/owner/allVendor`,
          { withCredentials: true }
        );
        if(result.data.success){
          console.log("done")
          console.log(result);
          dispatch(setVendors(result.data.vendors));
        }else{
          console.log("not done")
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchVendor()
  }, [dispatch]);
};

export default useGetAllVendor;
