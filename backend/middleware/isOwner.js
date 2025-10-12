// middleware/isOwner.js
export const isOwner = (req, res, next) => {
  
  try {
    // Assuming you already have `req.user` set by your auth middleware
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user data" });
    }
    console.log("user id:"+req.userId + "role "+req.role)
    if (req.role!== "owner") {
      return res.status(403).json({ success: false, message: "Access denied: Owners only" });
    }

    // User is owner → allow request
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error in isOwner middleware" });
  }
};
