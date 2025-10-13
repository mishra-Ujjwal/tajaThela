import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) {
      toast.error("You must login first!");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || !user._id) return null; // prevent rendering children

  return children;
};

export default ProtectedRoute;
