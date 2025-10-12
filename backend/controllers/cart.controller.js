import Cart from "../models/cart.model.js";
import VendorProduct from "../models/vendorProduct.model.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { vendorId, vegetableId, quantity } = req.body;

    // find vendor product details
    const vendorProduct = await VendorProduct.findOne(
      { vendorId, "vegetables.vegetableId": vegetableId },
      { "vegetables.$": 1 }
    ).populate("vegetables.vegetableId");

    if (!vendorProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const veg = vendorProduct.vegetables[0];
    const name = veg.vegetableId.name;
    const price = veg.price;
    const unit = veg.unit;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ vendorId, vegetableId, name, price, unit, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.vegetableId.toString() === vegetableId &&
          item.vendorId.toString() === vendorId
      );

      if (itemIndex > -1) {
        // ✅ Always set final quantity (no +=)
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ vendorId, vegetableId, name, price, unit, quantity });
      }
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get user cart
export const getCart = async (req, res) => {
  try {
    const  userId  = req.userId;
    const cart = await Cart.findOne({ userId }).populate("items.vegetableId");

    if (!cart) return res.json({ success: true, cart: { items: [] } });

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const {vegetableId, vendorId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.vegetableId.toString() === vegetableId &&
        item.vendorId.toString() === vendorId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json({ success: true, cart });
    }

    res.status(404).json({ success: false, message: "Item not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { vendorId, vegetableId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: true, cart: { items: [] } });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.vendorId.toString() === vendorId &&
        item.vegetableId.toString() === vegetableId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1); // remove item
      }
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
