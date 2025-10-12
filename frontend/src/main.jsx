import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "../src/router.jsx";
import { Provider } from "react-redux";
import { store } from "../redux/store.js";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
<Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer
            position="top-right" 
            autoClose={2000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            draggable 
            theme="light" 
          />
    </Provider>
    

);