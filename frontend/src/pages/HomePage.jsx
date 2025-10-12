import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard.jsx";
import OwnerDashboard from "../components/OwnerDashboard.jsx";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard.jsx";

const HomePage = () => {
    const user = useSelector((state)=>state.user.userData)
    console.log(user)
  return (
    <div className="h-auto w-screen">
        {!user && <UserDashboard/>}
        {user?.role==="user"&&<UserDashboard/>}
        {user?.role==="owner"&&<OwnerDashboard/>}
        {user?.role==="deliveryBoy"&&<DeliveryBoyDashboard/>}
    </div>
  );
};

export default HomePage;
