import userModel from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "user id is not found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
export const updateCity = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { city } = req.body;

    if (!city)
      return res
        .status(400)
        .json({ success: false, message: "City is required" });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { city },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, long } = req.body;
    const userId = req.userId;
    const user = await userModel.findByIdAndUpdate(userId, {
      location: {
        type:"Point",
        coordinates:[long,lat],
      },
    },{new:true});
    if (!user) {
      return res.json({ success: "false", message: "user is not found" });
    }
    return res.json({success:true,message:"location is Updated"})
  } catch (err) {
      return res.json({ success: "false", message: err.message });

  }
};
