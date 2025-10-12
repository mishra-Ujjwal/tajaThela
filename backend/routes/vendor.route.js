import express from "express"
import isAuth from "../middleware/isAuth.js"
import { allVendor, updateCartImage } from "../controllers/vendor.controller.js"
const vendorRouter = express.Router()
vendorRouter.get("/allVendor",allVendor)
vendorRouter.put("/cart-image", isAuth, updateCartImage);
export default vendorRouter;