import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Enter Valid Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter Password"],
    },
    mobile: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "owner", "deliveryBoy"],
      default: "user",
    },
    city: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

const userModel = mongoose.model("user", userSchema);
export default userModel;
