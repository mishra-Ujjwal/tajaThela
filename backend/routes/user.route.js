import express from "express"
import {login,CreateAccount,logout} from "../controllers/userAuth.controller.js"
import { getCurrentUser, updateCity, updateLocation } from "../controllers/user.controller.js"
import isAuth from "../middleware/isAuth.js"
export const userRouter = express.Router()
userRouter.post("/signup",CreateAccount)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/user",isAuth,getCurrentUser)
userRouter.post("/updateCity",isAuth,updateCity)

userRouter.post("/updateLocation",isAuth,updateLocation)