// redux/vendorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    vendorData: [],   // <-- must start as [] not null
  },
  reducers: {
    setVendors: (state, action) => {
      state.vendorData = action.payload;
    },
    clearVendors: (state) => {
      state.vendorData = [];
    },
  },
});

export const { setVendors, clearVendors } = vendorSlice.actions;
export default vendorSlice.reducer;
