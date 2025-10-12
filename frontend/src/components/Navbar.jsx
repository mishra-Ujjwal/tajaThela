import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoLocation, IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaCaretDown, FaBell } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import UserMenu from "./UserMenu.jsx";
import OwnerMenu from "./OwnerMenu.jsx";

const Navbar = () => {
  const user = useSelector((state) => state.user.userData);
  const cart = useSelector((state) => state.user.cartItems);
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [ownerUserMenu, setOwnerUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 📍 Detect Location
  const detectMyLocation = () => {
    console.log("Detect location");
  };

  // 🔔 Fetch Notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/notification`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);
  const clearAllNotifacation=async()=>{
    try{
       const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/clear-notification`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setNotifications([]);
        }
    }catch(err){
      console.log(err)
    }
  }
  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-dropdown")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setShowUserMenu(false);
  const closeSearch = () => setShowSearch(false);

  // 🛎️ Notification item click handler
  const handleNotificationClick = (note) => {
    console.log("Clicked notification:", note);
    // Optional: navigate to some page or mark as read
    setShowNotifications(false);
  };

  return (
    <>
      {/* USER NAVBAR */}
      {(!user || user?.role === "" || user?.role === "user") && (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 lg:px-8">
            <div className="flex items-center sm:justify-normal justify-between gap-5 h-16">
              {/* 🟢 Logo + Location */}
              <div className="flex items-center w-1/3 text-base font-normal">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-18 sm:h-20 cursor-pointer"
                  onClick={() => navigate("/")}
                />
                {user?.city ? (
                  <div className="hidden sm:flex items-center gap-1 ml-4">
                    <IoLocation size={25} className="text-orange-600" />
                    <h2 className="line-clamp-2 w-[80%]">{user.city}</h2>
                  </div>
                ) : (
                  <div
                    className="hidden sm:flex items-center gap-1 ml-4 cursor-pointer"
                    onClick={detectMyLocation}
                  >
                    <IoLocation size={30} />
                    <h2 className="line-clamp-2">Choose Location...</h2>
                  </div>
                )}
              </div>

              {/* 🔍 Desktop Search */}
              <div className="hidden sm:flex flex-1 mx-6 max-w-2xl">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for fresh vegetables..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <IoSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* 🧭 Right Section */}
              <div className="flex items-center gap-4">
                {/* Mobile search toggle */}
                <div
                  className="sm:hidden cursor-pointer"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  {showSearch ? <RxCross2 size={25} /> : <IoSearch size={25} />}
                </div>

                {/* 🔔 Notification Bell */}
                {user && (
                  <div className="relative">
                    <div
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FaBell size={22} className="text-gray-700" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {notifications.length}
                        </span>
                      )}
                    </div>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 notification-dropdown">
                        <div className="p-3 border-b font-semibold text-gray-700 flex justify-between">
                          Notifications
                          <button
                            onClick={() => clearAllNotifacation()}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>

                        {notifications.length === 0 ? (
                          <div className="p-4 text-gray-500 text-center">
                            No new notifications
                          </div>
                        ) : (
                          <div className="max-h-60 overflow-auto">
                            {notifications.map((note, idx) => (
                              <div
                                key={idx}
                                onClick={() => handleNotificationClick(note)}
                                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="font-medium text-gray-800">
                                  {note.title || "New update"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {note.message}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(note.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 👤 Login / User */}
                {!user ? (
                  <Link to="/login">
                    <div className="text-green-800 text-lg px-3 lg:text-xl sm:px-4 sm:py-1 sm:bg-gray-200 font-semibold rounded-lg hover:text-green-700 transition-colors">
                      Login
                    </div>
                  </Link>
                ) : (
                  <div className="relative">
                    <h2
                      className="hidden sm:flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      Your Account <FaCaretDown />
                    </h2>
                    <h2
                      className="flex sm:hidden items-center cursor-pointer"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <p className="px-3 py-1 text-white font-semibold text-lg rounded-full bg-orange-600">
                        {user?.name.slice(0, 1).toUpperCase()}
                      </p>
                    </h2>
                    {showUserMenu && <UserMenu onClose={closeMenu} />}
                  </div>
                )}

                {/* 🛒 Cart */}
                <div className="cursor-pointer relative">
                  <TiShoppingCart size={30} />
                  <p className="absolute text-green-600 -top-3 right-0 text-base font-medium">
                    {cart.length}
                  </p>
                </div>
              </div>
            </div>

            {/* 📱 Mobile Search */}
            {showSearch && (
              <div className="flex sm:hidden items-center border border-gray-300 mt-2 px-2">
                <IoLocation size={20} className="mr-2" />
                <h2 className="line-clamp-2 w-1/3">{user?.city || "Location"}</h2>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search for fresh vegetables..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* OWNER NAVBAR */}
      {user?.role === "owner" && (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <img src="/logo.png" alt="logo" className="h-20" onClick={()=>navigate("/")} />
              <div
                className="flex items-center gap-2 relative cursor-pointer"
                onClick={() => setOwnerUserMenu(!ownerUserMenu)}
              >
                <div className="text-lg font-semibold">
                  {user?.name.toUpperCase()}
                </div>
                <div className="px-3 py-1 flex items-center justify-center text-xl font-semibold text-white rounded-full bg-orange-500">
                  {user?.name.slice(0, 1).toUpperCase()}
                </div>
                {ownerUserMenu && <OwnerMenu onClose={closeMenu} />}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* DELIVERY BOY NAVBAR */}
      {user?.role === "deliveryBoy" && (
        <nav className="flex items-center justify-between px-5 shadow-lg">
          <img src="/logo.png" alt="" className="w-28" />
          <div className="flex items-center gap-2">
            <CgProfile size={25} />
            <div className="relative">
              <h2
                className="hidden sm:flex items-center gap-1 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                Your Account <FaCaretDown />
              </h2>
              <h2
                className="flex sm:hidden items-center cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <p className="px-3 py-1 text-white font-semibold text-lg rounded-full bg-orange-600">
                  {user?.name.slice(0, 1).toUpperCase()}
                </p>
              </h2>
              {showUserMenu && <UserMenu onClose={closeMenu} />}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
