// models/cartModel.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, //vendor's id
        vegetableId: { type: mongoose.Schema.Types.ObjectId, ref: "vegetableMaster", required: true }, //name and image comes from vegetable master
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
