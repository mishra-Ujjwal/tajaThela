import express from "express";
import vegetableModel from "../models/vegetableMaster.model.js";
import vendorProductModel from "../models/vendorProduct.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// Get all vegetable master list
export const getVegetableMaster = async (req, res) => {
  try {
    const vegetables = await vegetableModel.find();
    res.json({ success: true, vegetables });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
//uppload cartImage

export const uploadImage = async (req, res) => {
  try {
    const vendorId = req.userId;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const image = await uploadOnCloudinary(req.file.path);

    const updatedVendorProduct = await vendorProductModel.findOneAndUpdate(
      { vendorId },
      { cartImage: image },
      { new: true }
    ).populate("vegetables.vegetableId");

    res.json({ success: true, vendorProduct: updatedVendorProduct });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message }); // Send proper backend error
  }
};



// Add vegetable to vendor product
export const addVendorProduct = async (req, res) => {
  try {
    const vendorId = req.userId;
    const { vegetableId, price, quantity, unit } = req.body;
    console.log(req.body)
    if (!vegetableId || !price || !quantity || !unit) {
      return res.json({ success: false, message: "All fields are required" });
    }

    let vendorProduct = await vendorProductModel.findOne({ vendorId });

    if (!vendorProduct) {
      vendorProduct = new vendorProductModel({
        vendorId,
        vegetables: [{ vegetableId, price, quantity, unit }],
      });
      await vendorProduct.save();
      return res.json({ success: true, vendorProduct });
    }

    const existingIndex = vendorProduct.vegetables.findIndex(
      (v) => v.vegetableId.toString() === vegetableId
    );

    if (existingIndex !== -1) {
      vendorProduct.vegetables[existingIndex] = { vegetableId, price, quantity, unit };
    } else {
      vendorProduct.vegetables.push({ vegetableId, price, quantity, unit });
    }

    await vendorProduct.save();

    const populatedProduct = await vendorProductModel
      .findById(vendorProduct._id)
      .populate("vegetables.vegetableId");

    res.json({ success: true, vendorProduct: populatedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


// Get vendor products
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.userId;
    const vendorProduct = await vendorProductModel
      .findOne({ vendorId })
      .populate("vegetables.vegetableId");

    if (!vendorProduct) return res.json({ success: true, vendorProduct: null });

    res.json({ success: true, vendorProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};




// Update a vegetable in vendor product
export const updateVendorProduct = async (req, res) => {
  try {
    const vendorId = req.userId;
    const { vegetableId, price, quantity, unit } = req.body;

    if (!vegetableId || !price || !quantity || !unit) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const vendorProduct = await vendorProductModel.findOne({ vendorId });
    if (!vendorProduct) {
      return res.json({ success: false, message: "Vendor product not found" });
    }

    const index = vendorProduct.vegetables.findIndex(
      (v) => v.vegetableId.toString() === vegetableId
    );

    if (index === -1) {
      return res.json({ success: false, message: "Vegetable not found in your products" });
    }

    vendorProduct.vegetables[index] = { vegetableId, price, quantity, unit };
    await vendorProduct.save();

    const populatedProduct = await vendorProductModel
      .findById(vendorProduct._id)
      .populate("vegetables.vegetableId");

    res.json({ success: true, vendorProduct: populatedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete a vegetable from vendor product
// Delete a vegetable from vendor product
export const deleteVendorProduct = async (req, res) => {
  try {
    const vendorId = req.userId;           // Get vendor from auth
    const { vegetableId } = req.body;    // Vegetable ID sent from frontend

    // Find vendor's product
    const vendorProduct = await vendorProductModel.findOne({ vendorId });
    if (!vendorProduct) {
      return res.json({ success: false, message: "Vendor product not found" });
    }

    // Find the vegetable in the array
    const index = vendorProduct.vegetables.findIndex(
      (v) => v.vegetableId.toString() === vegetableId
    );

    if (index === -1) {
      return res.json({ success: false, message: "Vegetable not found in your products" });
    }

    // Remove it from the array
    vendorProduct.vegetables.splice(index, 1);
    await vendorProduct.save();

    // Return updated product list
    const populatedProduct = await vendorProductModel
      .findById(vendorProduct._id)
      .populate("vegetables.vegetableId");

    res.json({ success: true, vendorProduct: populatedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
