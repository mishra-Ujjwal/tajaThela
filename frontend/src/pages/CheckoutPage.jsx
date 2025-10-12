// CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useGetLocation from "../../Hooks/useGetLocation";
import { setAddress, setLocation } from "../../redux/mapSlice";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

function RecentreMap({ location }) {
  const map = useMap();

  React.useEffect(() => {
    if (location.lat && location.long) {
      map.setView([location.lat, location.long], 16, { animate: true });
    }
  }, [location, map]); // ✅ Re-run whenever location changes

  return null;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useGetLocation();
  const { location, address } = useSelector((state) => state.map);
  const cart = useSelector((state) => state.user.cartItems);

  const center = [location?.lat, location?.long];

  // --- Location + Address helpers ---
  const handleDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, long: lng }));
    getAddressBylatlong({ lat, long: lng });
  };

  const getAddressBylatlong = async (loc) => {
    try {
      const geolocation = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${loc.lat}&lon=${
          loc.long
        }&format=json&apiKey=${import.meta.env.VITE_GEO_APIFY_API}`
      );
      const city =
        geolocation.data.results[0].formatted ||
        geolocation.data.results[0].city;
      dispatch(setAddress(city));
    } catch (err) {
      console.error(err);
    }
  };

const handleCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      // ✅ Immediately update map with coordinates
      dispatch(setLocation({ lat: latitude, long: longitude }));

      // Fetch address asynchronously, no blocking
      axios
        .get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_APIFY_API}`
        )
        .then((res) => {
          const city =
            res.data.results[0].formatted || res.data.results[0].city;
          dispatch(setAddress(city));
        })
        .catch((err) => console.error(err));
    },
    (err) => {
      toast.error("Unable to fetch your location");
      console.error(err);
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
};


  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${import.meta.env.VITE_GEO_APIFY_API}`
      );
      const lat = result.data.features[0].properties.lat;
      const long = result.data.features[0].properties.lon;
      dispatch(setLocation({ lat, long }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  // --- Cart calculations ---
  const itemsTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = 10;
  const deliveryFee = itemsTotal >= 200 ? 0 : 40;
  const grandTotal =
    cart.length > 0 ? itemsTotal + shippingFee + deliveryFee : 0;

  // --- Place Order Handler ---
  const handlePlaceOrder = async () => {
  if (!location.lat || !location.long) {
    toast.error("Fetching location... Please wait.");
    return;
  }
  if (!addressInput.trim()) {
    toast.error("Please wait — fetching address details.");
    return;
  }
  if (!cart.length) {
    toast.error("Cart is empty");
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/place-order`,
      {
        cartItems: cart,
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          lat: location.lat,
          long: location.long,
        },
        grandTotal,
      },
      { withCredentials: true }
    );

    if (paymentMethod === "COD") {
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      navigate("/order-placed");
    } else {
      const { razorOrder, cartItems, grandTotal } = response.data;
      openRazorpayWindow(razorOrder, cartItems, grandTotal);
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to place order");
  }
};

const openRazorpayWindow = (razorOrder, cartItems, grandTotal) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: razorOrder.amount,
    currency: razorOrder.currency,
    name: "Taja Thela",
    description: "Order Payment",
    order_id: razorOrder.id,
    handler: async function (response) {
      try {
        const result = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/verify-payment`,
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: razorOrder.id,
            cartItems,
            grandTotal,
            deliveryAddress: {
              text: addressInput,
              lat: location.lat,
              long: location.long,
            },
          },
          { withCredentials: true }
        );

        if (result.data.success) {
          toast.success("✅ Payment successful & order placed!");
          dispatch(clearCart());
          setTimeout(() => navigate("/order-placed"), 100);
        } else {
          toast.error(result.data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Payment verification failed");
      }
    },
    modal: { ondismiss: () => toast.info("Payment popup closed") },
    theme: { color: "#F37254" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  // --- Billing Box ---
  const CartBox = () => (
    <div className="h-auto sm:w-lg flex flex-col ">
      <p className="text-xl font-semibold mb-2 w-full">Billing</p>
      <div className="flex-1 overflow-y-auto pb-2">
        {cart.length > 0 ? (
          <ul className="space-y-1">
            {cart.map((item,idx) => (
              <li
                key={idx}
                className="bg-white p-1 rounded flex items-center gap-2"
              >
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="ml-2 font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in cart</p>
        )}
      </div>

      {/* Billing Summary */}
      <div className="border-t pt-2 text-sm px-1">
        <div className="flex justify-between">
          <span>Items Total</span>
          <span>₹{itemsTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>₹{shippingFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span>
              <span className="line-through text-gray-500">₹25</span>{" "}
              <span className="text-green-600">Free</span>
            </span>
          ) : (
            <span>₹{deliveryFee}</span>
          )}
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <div className="w-screen min-h-[100vh] bg-orange-50 p-6 shadow-md rounded-lg sm:flex justify-center sm:gap-4 gap-2">
        {/* Delivery Section */}
        <div className="sm:w-1/3 w-full">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
          {/* Location Section */}
          <div className="mb-6">
            <div className="flex items-center text-red-600 font-medium mb-2">
              <FaMapMarkerAlt className="mr-2" /> Delivery Location
            </div>
            <div
              className="w-full text-center font-medium cursor-pointer bg-white p-3 border rounded-lg flex items-center gap-2"
              onClick={handleCurrentLocation}
            >
              Use My Current Location <BiCurrentLocation size={30} />
            </div>
            <div className="text-center text-lg font-semibold">OR</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-3 text-lg"
                placeholder={address ? address : "Fetching your address..."}
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <div
                className="px-2 py-2 rounded-lg mb-3 bg-red-500 text-white font-bold cursor-pointer"
                onClick={getLatLngByAddress}
              >
                <IoIosSearch size={25} />
              </div>
            </div>
            <div className="w-full h-56 border rounded-md overflow-hidden">
              {location?.lat && location?.long ? (
                <MapContainer
                  className="w-full h-full"
                  center={center}
                  zoom={15}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecentreMap location={location} />
                  <Marker
                    position={[location.lat, location.long]}
                    draggable
                    eventHandlers={{ dragend: handleDragEnd }}
                  />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  Getting your location...
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <p className="text-lg font-semibold mb-3 flex items-center">
              <MdOutlinePayment className="mr-2" /> Payment Method
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "COD"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("COD")}
              >
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "ONLINE"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("ONLINE")}
              >
                <p className="font-medium">UPI / Card</p>
                <p className="text-sm text-gray-500">Pay securely online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="sm:pt-10">
          <CartBox />
          <div
            className="w-full bg-red-600 text-center text-white py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
            onClick={handlePlaceOrder}
          >
            Place Order
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
