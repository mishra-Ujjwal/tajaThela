import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleAddToCart, clearCart } from "../redux/userSlice";

export const useGetCart = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/cart/`,
          { withCredentials: true }
        );

        if (result.data.success) {
          const { items } = result.data.cart;

          // Clear old cart
          dispatch(clearCart());

          // Add items from backend
          items.forEach((item) => {
            dispatch(
              handleAddToCart({
                vendorId: item.vendorId,
                vegetableId: item.vegetableId._id,
                name: item.vegetableId.name,
                price: item.price,
                quantity: item.quantity,
                unit: item.unit,
                image:item.vegetableId.image,
              })
            );
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [dispatch]);
};
