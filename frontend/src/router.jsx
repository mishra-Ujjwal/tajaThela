import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import VendorPage from "./pages/VendorPage.jsx";
import OrderPlaced from "./components/OrderPlaced.jsx";
import UserOrder from "./components/UserOrder.jsx";
import OwnerOrder from "./components/OwnerOrder.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      {
        path: "vendor-profile/:vendorId",
        element: (
          <ProtectedRoute>
            <VendorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
            <CheckoutPage />
        ),
      },
      {
        path: "user-orders",
        element: (
            <UserOrder />
         
        ),
      },
      {
        path: "owner-orders",
        element: (
            <OwnerOrder />
        ),
      },
      {
        path: "order-placed",
        element: (
            <OrderPlaced />
        ),
      },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignUpPage /> },
]);

export default router;
