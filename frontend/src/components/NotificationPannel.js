import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/notifications`,
      { withCredentials: true }
    );
    setNotifications(res.data.notifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow w-80">
      <h3 className="text-lg font-bold mb-2">Notifications 🔔</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n._id} className="border-b pb-2">
              <p className="font-semibold">{n.title}</p>
              <p className="text-gray-600 text-sm">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
