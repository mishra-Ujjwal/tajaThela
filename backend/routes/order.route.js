// routes/cartRoutes.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import { acceptOrderToDeliver, deleteAllNotification, generateDeliveredOtp, getCurrentDelivery, getDeliveryBoyAssignment, getUserNotifications, getUserOrders, getVendorOrders, placeOrder, testRazorpay, trackUserOrder, updateOrderStatus, verifyDeliveryOtp, verifyPayment } from "../controllers/oder.controller.js";

const orderRouter = express.Router();

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.post("/verify-payment",isAuth,verifyPayment)
orderRouter.get("/orders",isAuth,getUserOrders)
orderRouter.get("/vendor-orders",isAuth,getVendorOrders)
orderRouter.patch("/update-status/:vendorId/:orderId",isAuth,updateOrderStatus);
orderRouter.get("/get-assigned-deliveryboys",isAuth,getDeliveryBoyAssignment)
orderRouter.patch("/accept-order",isAuth,acceptOrderToDeliver);
orderRouter.get("/get-current-delivery",isAuth,getCurrentDelivery)
orderRouter.get("/generate-otp/:orderId",isAuth,generateDeliveredOtp);

orderRouter.post("/verify-delivery-otp",isAuth,verifyDeliveryOtp)
orderRouter.get("/track-user-order/:orderId",isAuth, trackUserOrder);
orderRouter.get("/notification",isAuth, getUserNotifications);
orderRouter.get("/clear-notification",isAuth, deleteAllNotification);

orderRouter.get("/test-razorpay", testRazorpay);

export default orderRouter;
