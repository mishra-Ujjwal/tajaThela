// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [
      {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        vegetableId: { type: mongoose.Schema.Types.ObjectId, ref: "vegetableMaster", required: true },
        name: String,
        image: String,
        unit: String,
        price: Number,
        quantity: Number,
      },
    ],
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    status: { type: String,
      enum: ["Pending", "Preparing", "Out for Delivery","delivered"],
     default: "Pending" },
    deliveryAddress: {
      text: String,
      lat:Number,
      long: Number,
    },
    assignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"delivery",
      default:null
    },
    assignDeliveryBoy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
    },
    deliveredOtp:{
      type:Number,
    },
    payment:{
      type:Boolean,
      default:false,
    },
    razorpayOrderId:{
      type:String,
      default:""
    },
    razorpayPaymentId:{
      type:String,
      default:""
    }
  },

  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
