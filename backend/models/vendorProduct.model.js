// models/vendorProductModel.js
import mongoose from "mongoose";

const vendorProductSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartImage:{
      type:String,
    },
    vegetables: [
      {
        vegetableId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "vegetableMaster", // master list of veggies
          required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }, // stock
        unit:{type:String,required:true},
      },
    ],
  },
  { timestamps: true }
);

const VendorProduct = mongoose.model("vendorProduct", vendorProductSchema);
export default VendorProduct;
