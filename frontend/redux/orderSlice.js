// store/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userOrders: [],    // Orders for logged-in user
  vendorOrders: [],  // Orders for logged-in vendor
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserOrdersSuccess: (state, action) => {
      state.loading = false;
      state.userOrders = action.payload;
    },
    fetchVendorOrdersSuccess: (state, action) => {
      state.loading = false;
      state.vendorOrders = action.payload;
    },
    fetchOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrders: (state) => {
      state.userOrders = [];
      state.vendorOrders = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchUserOrdersSuccess,
  fetchVendorOrdersSuccess,
  fetchOrdersFail,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
