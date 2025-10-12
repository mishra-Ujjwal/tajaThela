
import express from "express";
import isAuth from "../middleware/isAuth.js";
import {addToCart, getCart, removeCartItem, updateCartItem} from "../controllers/cart.controller.js"
const cartRouter = express.Router();
// Get all cart items for logged-in user
cartRouter.get("/", isAuth, getCart);
cartRouter.post("/add", isAuth, addToCart);
cartRouter.post("/update", isAuth, updateCartItem);
cartRouter.post("/remove", isAuth, removeCartItem);


export default cartRouter;
