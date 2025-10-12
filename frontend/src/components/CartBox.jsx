import React from "react";
import { useSelector } from "react-redux";
import { IoIosArrowForward } from "react-icons/io";

const CartBox = ({ handleAdd, handleRemove }) => {
  const cart = useSelector((state) => state.cartItem.cart);

  const itemsTotal = cart.reduce(
    (total, item) => total + item.price * item.selectedQuantity,
    0
  );
  const shippingFee = cart.length ? 10 : 0; // no fee if cart empty
  const deliveryFee = itemsTotal > 100 || itemsTotal === 0 ? 0 : 25;
  const grandTotal = itemsTotal + shippingFee + deliveryFee;

  return (
    <div className="h-full flex flex-col">
      <p className="text-xl font-semibold mb-2">Cart</p>
      <div className="flex-1 overflow-y-auto pb-10">
        {cart.length > 0 ? (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.vegetableItemId}
                className="bg-white p-2 rounded flex items-center gap-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.selectedQuantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemove(item)}
                    className="px-2 bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                  <span>{item.selectedQuantity}</span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="px-2 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                </div>
                <span className="ml-2 font-semibold">
                  ₹{item.price * item.selectedQuantity}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in cart</p>
        )}
      </div>

      {/* Billing */}
      <div className="border-t pt-2 text-sm">
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

      {cart.length > 0 && (
        <div className="mt-3 bg-green-700 text-white py-2 px-4 rounded flex justify-between items-center cursor-pointer">
          Proceed to Checkout <IoIosArrowForward />
        </div>
      )}
    </div>
  );
};

export default CartBox;
