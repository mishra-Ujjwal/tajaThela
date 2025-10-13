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
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-orders",
        element: (
          <ProtectedRoute>
            <UserOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner-orders",
        element: (
          <ProtectedRoute>
            <OwnerOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-placed",
        element: (
          <ProtectedRoute>
            <OrderPlaced />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignUpPage /> },
]);

export default router;
