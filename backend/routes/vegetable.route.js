import express from "express"
import {  addVendorProduct, getVegetableMaster, getVendorProducts, updateVendorProduct, uploadImage } from "../controllers/vegetable.js"
import { isOwner } from "../middleware/isOwner.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
const vegetableRouter = express.Router()

vegetableRouter.get("/allVegetableList",getVegetableMaster)
vegetableRouter.post("/addVegetable",isAuth,addVendorProduct)
vegetableRouter.get("/product",isAuth,getVendorProducts)

vegetableRouter.post("/update",isAuth,updateVendorProduct)

vegetableRouter.post(
  "/uploadImage",
  isAuth,
  upload.single("image"), // 'image' must match frontend FormData key
  uploadImage
);

export default vegetableRouter;