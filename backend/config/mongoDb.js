import mongoose from "mongoose"
 import dotenv from "dotenv"
 dotenv.config();

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Try for 20s before timeout
      socketTimeoutMS: 45000,
    });
    console.log("db connected");
  } catch (err) {
    console.log("db connection error: " + err);
  }
}
export default connectDb;
