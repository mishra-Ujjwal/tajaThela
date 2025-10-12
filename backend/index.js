import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/mongoDb.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import vegetableRouter from "./routes/vegetable.route.js";
import vendorRouter from "./routes/vendor.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

dotenv.config();
const port = process.env.PORT || 5000;

// CORS setup for production
app.use(
  cors({
    origin: "https://tajathela-wy9b.onrender.com", // frontend URL
    credentials: true, // allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));

// Routers
app.use("/api/", userRouter);
app.use("/vendor/", vegetableRouter);
app.use("/owner/", vendorRouter);
app.use("/user/cart/", cartRouter);
app.use("/user/", orderRouter);

// Connect MongoDB
const connectDatabase = async () => await connectDb();
connectDatabase();

// Start server
app.listen(port, () => console.log("Server is running on port " + port));
