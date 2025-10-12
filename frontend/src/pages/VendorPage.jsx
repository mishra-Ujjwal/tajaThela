// VendorPage.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { handleAddToCart, handleRemoveFromCart } from "../../redux/userSlice";
import axios from "axios";

const VendorPage = () => {
  const { vendorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allVendor = useSelector((state) => state.vendor.vendorData);
  const cart = useSelector((state) => state.user.cartItems);

  const vendor = allVendor?.find(
    (v) => v?.vendorId?._id?.toString() === vendorId?.toString()
  );

  const [showCartMobile, setShowCartMobile] = useState(false);

  // Add item to cart
 const handleAdd = async ({ vegetableId, name, price, unit, image }) => {
  const cartItem = cart.find(
    (item) => item.vendorId === vendorId && item.vegetableId === vegetableId
  );
  const newQuantity = (cartItem?.quantity || 0) + 1;

  try {
    // Backend request
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/add`,
      { vendorId, vegetableId, quantity: newQuantity },
      { withCredentials: true }
    );

    // Redux update
    dispatch(
      handleAddToCart({
        vendorId,
        vegetableId,
        name,
        price,
        unit,
        image,
        quantity: newQuantity,
      })
    );
    toast.success(`${name} added to cart`);
  } catch (err) {
    console.error("Add to cart error:", err);

    if (err.response) {
      if (err.response.status === 401) {
        toast.error("❌ You are not authorized. Please login first!");
        navigate("/login");
      } else {
        toast.error(err.response.data?.message || "Failed to add item to cart");
      }
    } else if (err.request) {
      toast.error("No response from server. Check your network.");
    } else {
      toast.error(err.message);
    }
  }
};

// Remove item from cart
const handleRemove = async ({ vegetableId, name, price, unit, image }) => {
  const cartItem = cart.find(
    (item) => item.vendorId === vendorId && item.vegetableId === vegetableId
  );
  if (!cartItem) return;

  const newQuantity = cartItem.quantity - 1;

  try {
    // Backend request
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/remove`,
      { vendorId, vegetableId, quantity: newQuantity },
      { withCredentials: true }
    );

    // Redux update
    dispatch(
      handleRemoveFromCart({
        vendorId,
        vegetableId,
        quantity: newQuantity,
        image,
      })
    );
    toast.info(`${name} removed from cart`);
  } catch (err) {
    console.error("Remove from cart error:", err);

    if (err.response) {
      if (err.response.status === 401) {
        toast.error("❌ You are not authorized. Please login first!");
        navigate("/login");
      } else {
        toast.error(err.response.data?.message || "Failed to remove item from cart");
      }
    } else if (err.request) {
      toast.error("No response from server. Check your network.");
    } else {
      toast.error(err.message);
    }
  }
};

  // Calculate subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Delivery logic
  const shippingFee = 10;
  const deliveryCharge = subtotal >= 200 ? 0 : 40;
  const total = subtotal + deliveryCharge + shippingFee;

  // CartBox component
  const CartBox = () => (
    <div>
      <h2 className="text-xl font-semibold mb-3">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="space-y-3">
          <div className="h-40 overflow-y-auto">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <img src={item?.image} alt="error" className="w-15" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    onClick={() =>
                      handleRemove({
                        vegetableId: item.vegetableId,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        image: item.image,
                      })
                    }
                    className="px-2 text-lg font-bold bg-red-500 text-white rounded"
                  >
                    -
                  </div>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <div
                    onClick={() =>
                      handleAdd({
                        vegetableId: item.vegetableId,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        image: item.image,
                      })
                    }
                    className="px-2 text-lg font-bold bg-green-500 text-white rounded"
                  >
                    +
                  </div>
                </div>

                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Sub Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 mt-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping Fee</span>
              <span>{shippingFee}</span>
            </div>
             <div className="flex justify-between">
          <span>Delivery Fee</span>
          {deliveryCharge === 0 ? (
            <span>
              <span className="line-through text-gray-500">₹25</span>{" "}
              <span className="text-green-600">Free</span>
            </span>
          ) : (
            <span>₹{deliveryCharge}</span>
          )}
        </div>

            <hr className="my-2" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <div
            className="py-3 px-4 rounded-lg bg-green-800 font-semibold text-white"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="min-h-[calc(100vh-80px)] w-screen">
      {/* Vendor Details */}
      <div className="w-screen bg-orange-50 px-4 py-4 lg:px-28">
        <div className="flex items-center sm:flex-row flex-col gap-4">
          <div className="sm:w-45 w-35 rounded-xl overflow-hidden">
            <img
              src={vendor?.cartImage}
              alt="Vendor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between space-y-2">
            <p className="sm:text-3xl text-2xl font-medium">
              {capitalizeFirstLetter(vendor?.vendorId?.name)} Sabjiwala
            </p>
            <div className="flex items-center gap-1">
              <CiLocationOn size={20} />
              <p className="line-clamp-2 sm:w-full ">
                {vendor?.vendorId?.city}
              </p>
            </div>
            <div className="flex gap-2 items-center text-lg">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} className="w-4" />
                ))}{" "}
                <p className="text-black">(124 Reviews)</p>
              </div>

              <div className="flex items-center gap-1">
                <MdOutlineVerified />
                <p>Organic Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products + Cart */}
      <div className="pt-5 px-4 py-4 lg:px-28">
        <div className="flex gap-4 items-start">
          {/* Products */}
          <div className="w-full lg:w-3/4 p-4 rounded-lg">
            <p className="text-2xl font-semibold mb-4">Available Products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vendor?.vegetables.map((veg, idx) => {
                const cartItem = cart.find(
                  (item) =>
                    item.vendorId === vendorId &&
                    item.vegetableId ===
                      (veg.vegetableId?._id || veg.vegetableId)
                );
                return (
                  <div
                    key={idx}
                    className="bg-white p-2 rounded shadow flex flex-col items-center"
                  >
                    <img
                      src={veg.vegetableId?.image}
                      alt={veg.vegetableId?.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="font-semibold">
                      {veg.vegetableId?.name || "Unknown"}
                    </p>
                    <p>
                      ₹{veg.price} / {veg.unit}
                    </p>
                    <p>Stock: {veg.quantity}</p>

                    {cartItem ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          onClick={() =>
                            handleRemove({
                              vegetableId: veg.vegetableId._id,
                              name: veg.vegetableId.name,
                              price: veg.price,
                              unit: veg.unit,
                              image: veg.vegetableId.image, // ✅ Pass image
                            })
                          }
                          className="px-3 py-0 text-xl font-bold !bg-red-500 text-white rounded"
                        >
                          -
                        </div>
                        <span className="text-lg font-semibold">
                          {cartItem.quantity}
                        </span>
                        <div
                          onClick={() =>
                            handleAdd({
                              vegetableId: veg.vegetableId._id,
                              name: veg.vegetableId.name,
                              price: veg.price,
                              unit: veg.unit,
                              image: veg.vegetableId.image, // ✅ Pass image
                            })
                          }
                          className="px-3 py-0 text-xl font-bold !bg-green-500 text-white rounded"
                        >
                          +
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          handleAdd({
                            vegetableId: veg.vegetableId._id,
                            name: veg.vegetableId.name,
                            price: veg.price,
                            unit: veg.unit,
                            image: veg.vegetableId.image, // ✅ Pass image
                          })
                        }
                        className="mt-2 px-3 py-1 !bg-green-500 text-white rounded hover:!bg-green-600"
                      >
                        Add
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart - Desktop */}
          <div className="hidden lg:block w-1/3 border-2 border-gray-300 p-4 rounded-lg h-[calc(80vh-30px)]">
            <CartBox />
          </div>
        </div>
      </div>

      {/* Cart - Mobile floating button */}
      <div
        className="lg:hidden fixed bottom-0 left-0 w-full bg-green-600 text-white py-3 px-4 flex justify-between items-center cursor-pointer"
        onClick={() => setShowCartMobile(true)}
      >
        <span>Cart ({cart.length>0 ? total : 0})</span>

      </div>

      {/* Cart Drawer - Mobile */}
      {showCartMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-white w-full max-h-[80vh] rounded-t-xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <div
                onClick={() => setShowCartMobile(false)}
                className="text-red-500 font-bold cursor-pointer"
              >
                ✕
              </div>
            </div>
            <CartBox />
          </div>
        </div>
      )}
    </section>
  );
};

export default VendorPage;
