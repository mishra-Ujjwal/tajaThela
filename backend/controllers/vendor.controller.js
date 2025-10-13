// vendor.controller.js
import VendorProduct from '../models/vendorProduct.model.js';


export const allVendor = async (req, res) => {
  try {
    const vendors = await VendorProduct.find({}).populate("vegetables.vegetableId").populate("vendorId");
    return res.json({ success: true, vendors });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
export const updateCartImage = async (req, res) => {
  try {
    const vendorId = req.userId; // set by isAuth middleware
    const { cartImage } = req.body;

    if (!cartImage) {
      return res.status(400).json({ success: false, message: "cartImage is required" });
    }

    const updatedVendorProduct = await VendorProduct.findOneAndUpdate(
      { vendorId },
      { cartImage },
      { new: true }
    );

    if (!updatedVendorProduct) {
      return res.status(404).json({ success: false, message: "Vendor product not found" });
    }

    res.json({ success: true, vendorProduct: updatedVendorProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};