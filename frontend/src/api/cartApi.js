import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Add item to cart
export const addToCart = async ({ vendorId, vendorProductId, vegetableId, quantity }) => {
  const res = await axios.post(
    `${backendUrl}/user/cart/add`,
    {
      vendorId,
      vendorProductId,
      vegetableId,
      quantity,
    },
    { withCredentials: true }
  );
  return res.data;
};

// Remove item from cart
export const removeFromCart = async ({ cartId, vendorId, vegetableId }) => {
  const res = await axios.post(
    `${backendUrl}/user/cart/remove`,
    {
      cartId,
      vendorId,
      vegetableId,
    },
    { withCredentials: true }
  );
  return res.data;
};

// Update quantity
export const updateCartQuantity = async ({ cartId, vendorId, vegetableId, quantity }) => {
  const res = await axios.post(
    `${backendUrl}/user/cart/update`,
    {
      cartId,
      vendorId,
      vegetableId,
      quantity,
    },
    { withCredentials: true }
  );
  return res.data;
};

// Get all cart items for the logged-in user
export const getCart = async () => {
  const res = await axios.get(`${backendUrl}/user/cart/`, {
    withCredentials: true,
  });
  return res.data;
};
