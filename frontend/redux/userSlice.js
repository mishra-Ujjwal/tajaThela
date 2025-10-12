import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

// ✅ Load cart from localStorage safely
let savedCart = [];
try {
  const stored = localStorage.getItem("cartItems");
  if (stored && stored !== "undefined") {
    savedCart = JSON.parse(stored);
  }
} catch (e) {
  console.error("Error parsing cartItems from localStorage", e);
  savedCart = [];
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    cartItems: savedCart,
    myOrders:null,
    vendorOrders:null,
  },
  reducers: {
    // ✅ Set user data
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    // ✅ Clear user data + cart
    clearUserData: (state) => {
      state.userData = null;
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    // ✅ Set city
    setCity: (state, action) => {
      state.city = action.payload;
    },

    // ✅ ADD TO CART (now includes image)
    handleAddToCart: (state, action) => {
      const { vendorId, vegetableId, name, price, unit, quantity, image } = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.vendorId === vendorId && item.vegetableId === vegetableId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        state.cartItems.push({
          vendorId,
          vegetableId,
          name,
          price,
          unit,
          quantity,
          image, // 👈 added image support
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ REMOVE FROM CART (with vendor isolation)
    handleRemoveFromCart: (state, action) => {
      const { vendorId, vegetableId, quantity } = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.vendorId === vendorId && item.vegetableId === vegetableId
      );

      if (!existingItem) return;

      if (quantity <= 0) {
        // remove specific vendor item
        state.cartItems = state.cartItems.filter(
          (item) => !(item.vendorId === vendorId && item.vegetableId === vegetableId)
        );
      } else {
        existingItem.quantity = quantity;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ CLEAR ENTIRE CART
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    setUserOrders:(state,action)=>{
      state.myOrders = action.payload;
    },
    setVendorOrders:(state,action)=>{
      state.vendorOrders = action.payload;
    }
  },
});

export const {
  setUserData,
  clearUserData,
  setCity,
  handleAddToCart,
  handleRemoveFromCart,
  clearCart,setUserOrders,
  setVendorOrders
} = userSlice.actions;

export default userSlice.reducer;
