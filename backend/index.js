import express from "express";
const app = express();
import cors from "cors"
import dotenv from "dotenv";
import connectDb from "./config/mongoDb.js";
import cookieParser from "cookie-parser";
import {userRouter} from "./routes/user.route.js";
import vegetableRouter from "./routes/vegetable.route.js";
import vendorRouter from "./routes/vendor.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
dotenv.config();
const port = process.env.PORT||5000;
//cors
app.use(cors({
  origin:"https://tajathela-wy9b.onrender.com",
  credentials:true,
}))
app.use(express.json()) //convert receiving data into json
app.use(cookieParser())

app.use("/public", express.static("public"));

//authrouters 
app.use("/api/",userRouter)

app.use("/vendor/",vegetableRouter)
app.use("/owner/",vendorRouter)
app.use("/user/cart/", cartRouter);
app.use("/user/", orderRouter);
// access mongodb
const connectDatabase =async()=>{
  await connectDb()
}
connectDatabase()
//start app
app.listen(port, () => {
  console.log("server is started");
});
