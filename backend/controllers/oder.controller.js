import mongoose from "mongoose";
import Order from "../models/order.model.js";
import VendorProduct from "../models/vendorProduct.model.js";
import Cart from "../models/cart.model.js";
import deliveryModel from "../models/deliveryAssignment.model.js";
import userModel from "../models/user.model.js";
import Notification from "../models/notificationModel.js";
import Razorpay from "razorpay";
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const testRazorpay = async (req, res) => {
  try {
    // Create a dummy order of ₹10
    const order = await instance.orders.create({
      amount: 1000, // ₹10 in paisa
      currency: "INR",
      receipt: "test_receipt_123",
    });
    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay connection failed:", err);
    res.status(500).json({ success: false, message: "Razorpay connection failed", error: err.message });
  }
};

// Place Order (frontend calls only for COD or to create Razorpay order)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, paymentMethod, deliveryAddress, grandTotal } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "You are Not authorized, Please Login!" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const orderItems = [];
    let total = 0;

    for (const item of cartItems) {
      const vendorProduct = await VendorProduct.findOne({
        vendorId: item.vendorId,
        "vegetables.vegetableId": item.vegetableId,
      });

      if (!vendorProduct) return res.status(404).json({ message: "Product not found" });

      const vegItem = vendorProduct.vegetables.find(
        (v) => v.vegetableId.toString() === item.vegetableId.toString()
      );
      if (!vegItem) return res.status(404).json({ message: "Vegetable not found" });

      const itemTotal = vegItem.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        vendorId: item.vendorId,
        vegetableId: item.vegetableId,
        name: item.name,
        image: item.image,
        unit: item.unit,
        price: vegItem.price,
        quantity: item.quantity,
      });
    }

    if (paymentMethod.toUpperCase() === "ONLINE") {
      // Only create Razorpay order, not DB order
      const amountInPaise = Math.round(Number(grandTotal) * 100);
      const razorOrder = await instance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt-${Date.now()}`,
      });

      return res.status(200).json({
        success: true,
        razorOrder,
        cartItems: orderItems,
        grandTotal,
      });
    }

    // COD → create order immediately
    const order = new Order({
      userId,
      products: orderItems,
      grandTotal: grandTotal || total,
      paymentMethod,
      status: "Pending",
      deliveryAddress,
      payment: false,
    });

    await order.save();
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify Payment → create order here
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_payment_id, razorpay_order_id, cartItems, grandTotal, deliveryAddress } =
      req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not captured" });
    }

    // Create order in DB only after successful payment
    const order = new Order({
      userId,
      products: cartItems,
      grandTotal,
      paymentMethod: "ONLINE",
      status: "Pending",
      deliveryAddress,
      payment: true,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await order.save();
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({ success: true, message: "Payment successful & order placed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get all orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - userId missing" });
    }

    // Fetch orders and populate vendor info for each product
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("products.vendorId", "name email phone"); // populate vendor name, email, phone

    const formattedOrders = orders.map((order) => {
      const groupedByVendor = {};

      order.products.forEach((product) => {
        const vendorId = product.vendorId._id.toString();
        if (!groupedByVendor[vendorId]) {
          groupedByVendor[vendorId] = {
            vendorId: vendorId,
            vendorName: product.vendorId.name,
            vendorEmail: product.vendorId.email,
            vendorPhone: product.vendorId.phone,
            items: [],
            subtotal: 0,
          };
        }

        groupedByVendor[vendorId].items.push({
          vegetableId: product.vegetableId,
          name: product.name,
          image: product.image,
          unit: product.unit,
          price: product.price,
          quantity: product.quantity,
        });

        groupedByVendor[vendorId].subtotal += product.price * product.quantity;
      });

      return {
        _id: order._id,
        status: order.status,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        grandTotal: order.grandTotal,
        createdAt: order.createdAt,
        vendors: Object.values(groupedByVendor),
        deliveryAssignment: order.assignment,
      };
    });

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("🔥 Error fetching user orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// Get vendor-specific orders
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.userId; // from auth middleware
    if (!vendorId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - vendorId missing" });
    }

    // ✅ Populate the assigned delivery boy details
    const orders = await Order.find({
      "products.vendorId": new mongoose.Types.ObjectId(vendorId),
    })
      .sort({ createdAt: -1 })
      .populate("assignDeliveryBoy");

    const vendorOrders = orders.map((order) => {
      // Extract only this vendor’s products
      const vendorProducts = order.products.filter(
        (p) => p.vendorId.toString() === vendorId.toString()
      );

      const subtotal = vendorProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return {
        _id: order._id,
        userId: order.userId,
        status: order.status,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        vendorProducts,
        subtotal,
        vendorId,
        assignment: order.assignment, // ✅ Keep the assignment ID
        assignDeliveryBoy: order.assignDeliveryBoy || null, // ✅ Delivery boy details
      };
    });

    res.status(200).json({ success: true, orders: vendorOrders });
  } catch (err) {
    console.error("🔥 Error fetching vendor orders:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { vendorId, orderId } = req.params; // fixed order
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Preparing", "Out for Delivery"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("products.vendorId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    let deliveryBoyPlayload = [];
    // Assign delivery if out for delivery
    if (status === "Out for Delivery") {
      const { lat, long } = updatedOrder.deliveryAddress;

      // ✅ Find nearby delivery boys (from user model)
      const nearByDelivery = await userModel.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(long), Number(lat)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDelivery.map((b) => b._id);

      // ✅ Find busy delivery boys (from deliveryModel)
      const busyIds = await deliveryModel
        .find({
          assignedTo: { $in: nearByIds },
          status: { $in: ["assigned"] },
        })
        .distinct("assignedTo");

      const freeIds = nearByIds.filter((id) => !busyIds.includes(id));

      if (freeIds.length === 0) {
        return res.status(200).json({
          order: updatedOrder,
          message: "No delivery boys available",
        });
      }

      // ✅ Create new delivery assignment
      const existing = await deliveryModel.findOne({
        order: orderId,
        vendor: vendorId,
        status: "broadcasted",
      });
      let deliveryAssignment;
      if (!existing) {
        deliveryAssignment = await deliveryModel.create({
          order: orderId,
          vendor: vendorId,
          broadcastedTo: freeIds,
          status: "broadcasted",
        });
      }
      updatedOrder.assignment = deliveryAssignment._id;
      //delivery boy payload
      deliveryBoyPlayload = nearByDelivery
        .filter((boy) => freeIds.includes(boy._id))
        .map((boy) => ({
          id: boy._id,
          name: boy.name,
          mobile: boy.mobile,
          longitude: boy.location.coordinates?.[0],
          lattitude: boy.location.coordinates?.[1],
        }));

      updatedOrder.assignDeliveryBoy = deliveryAssignment.assignedTo;

      return res.json({
        success: true,
        order: updatedOrder,
        assignDeliveryBoy: updatedOrder.assignDeliveryBoy,
        availableBoys: deliveryBoyPlayload,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("🔥 Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const assignments = await deliveryModel
      .find({
        broadcastedTo: req.userId,
        status: "broadcasted",
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "order", // populate the order object
        populate: { path: "userId" },
      })
      .populate("vendor");
    return res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const acceptOrderToDeliver = async (req, res) => {
  try {
    const deliveryBoyId = req.userId; // logged-in delivery boy
    const { deliveryAssignmentId } = req.body; // the delivery assignment to accept

    const assignment = await deliveryModel.findById(deliveryAssignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery assignment not found" });
    }
    if (assignment.status !== "broadcasted") {
      return res
        .status(404)
        .json({ success: false, message: "Delivery assignment is expired" });
    }
    //what if that delivery guy is already assigned
    const alreadyAssigned = await deliveryModel.findOne({
      assignedTo: req.userId,
      status: { $in: ["assigned"] },
    });
    if (alreadyAssigned) {
      return res.status(404).json({
        success: false,
        message: "you are already assigned to another order",
      });
    }
    // update the delivery assignment
    const updatedDelivery = await deliveryModel
      .findByIdAndUpdate(
        deliveryAssignmentId,
        {
          assignedTo: deliveryBoyId,
          status: "assigned",
          acceptedAt: new Date(),
        },
        { new: true } // return the updated document
      )
      .populate({
        path: "order",
        populate: { path: "userId" }, // populate user inside order
      })
      .populate("vendor")
      .populate("broadcastedTo")
      .populate("assignedTo");

    // also update order
    const updateOrder = await Order.findByIdAndUpdate(assignment.order._id, {
      assignment: deliveryAssignmentId,
      assignDeliveryBoy: deliveryBoyId,
    });
    updateOrder.save();
    if (!updatedDelivery) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery assignment not found" });
    }

    return res.json({ success: true, updatedDelivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
// Get currently assigned delivery for the delivery boy
export const getCurrentDelivery = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    // Find active assignment
    const assignment = await deliveryModel
      .findOne({ assignedTo: deliveryBoyId, status: "assigned" })
      .populate({
        path: "order",
        populate: { path: "userId" }, // populate user details
      })
      .populate("vendor")
      .populate("assignedTo");

    if (!assignment) {
      return res.status(200).json({ success: true, assignment: null });
    }

    return res.status(200).json({ success: true, assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const generateDeliveredOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);

    //now store that otp in deliveredOtp
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveredOtp: generatedOtp,
      },
      { new: true }
    );
    await Notification.create({
      userId: order.userId._id,
      orderId: order._id,
      title: "Delivery OTP",
      message: `Your delivery OTP is ${generatedOtp}. Please share it with the delivery partner.`,
    });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const verifyDeliveryOtp = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Compare OTP properly
    if (order.deliveredOtp !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // If OTP correct -> mark as delivered
    order.status = "delivered";
    await order.save();

    const delivery = await deliveryModel.findOne({
      assignedTo: deliveryBoyId,
      order: orderId,
    });
    if (delivery) {
      delivery.status = "delivered";
      delivery.assignedTo = null;
      await delivery.save();
    }

    return res.json({
      success: true,
      message: "✅ OTP verified. Delivery completed successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Controller: Track user order location
export const trackUserOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // ✅ Find the delivery assignment by orderId
    const assignment = await deliveryModel
      .findOne({ order: orderId })
      .populate("assignedTo") // Delivery boy
      .populate("order"); // Order details

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No active delivery found for this order",
      });
    }

    // ✅ Extract required location data
    const deliveryBoyLat = assignment.assignedTo.location.coordinates[1];
    const deliveryBoyLong = assignment.assignedTo.location.coordinates[0];
    const userLat = assignment.order.deliveryAddress.lat;
    const userLong = assignment.order.deliveryAddress.long;

    return res.json({
      success: true,
      assignment: {
        deliveryBoyLat,
        deliveryBoyLong,
        userLat,
        userLong,
        assignedTo: assignment.assignedTo,
        order: assignment.order,
      },
    });
  } catch (err) {
    console.error("❌ Error in trackUserOrder:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const deleteAllNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notification = await Notification.findOneAndDelete({ userId });
    await notification.save();
    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
