import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import App from "./App.jsx"
import HomePage from "./pages/HomePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx"
import VendorPage from "./pages/VendorPage.jsx";
import OrderPlaced from "./components/OrderPlaced.jsx";

import UserOrder from "./components/UserOrder.jsx";
import OwnerOrder from "./components/OwnerOrder.jsx";
const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {path:"",
                element:<HomePage/>
            },{
                path:"vendor-profile/:vendorId",
                element:<VendorPage/>
            },{
                path:"order-placed",
                element:<OrderPlaced/>
            },{
                path:"user-orders",
                element:<UserOrder/>
            },{
                path:"owner-orders",
                element:<OwnerOrder/>
            }
        ]
    },{
        path:"login",
            element:<LoginPage/>
    },{
            path:"Signup",
            element:<SignUpPage/>
        },{
            path:"/checkout",
            element:<CheckoutPage/>
        }
])
export default router;