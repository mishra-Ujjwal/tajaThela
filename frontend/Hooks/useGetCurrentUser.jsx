import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const useGetCurrentUser = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fethUser = async (req, res) => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data.user))

      } catch (err) {
        console.log(err)
      }
    };
    fethUser();
  }, []);
};

export default useGetCurrentUser;
