import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import vendorSlice from "./vendorSlice.js"

import mapSlice from "./mapSlice.js"
import orderSlice from "./orderSlice.js"
export const store = configureStore({
    reducer:{
       user:userSlice,
       vendor:vendorSlice,
       map:mapSlice,
       order:orderSlice,
    }
})