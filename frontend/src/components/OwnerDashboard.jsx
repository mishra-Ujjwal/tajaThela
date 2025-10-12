import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload.jsx";
import { IoCamera } from "react-icons/io5";
import VegetableMasters from "./VegetableMasters.jsx";
import VendorProductList from "./VendorProductList.jsx";
import OwnerOrder from "./OwnerOrder.jsx";
import axios from "axios";

const OwnerDashboard = () => {

  const [vendorProduct, setVendorProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingImage, setEditingImage] = useState(false);

  // ✅ Fetch vendor data (profile)
  

  // ✅ Fetch vendor product (including cart image)
  const getVendorProduct = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/product`,
        { withCredentials: true }
      );
      if (result.data.success) {
        setVendorProduct(result.data.vendorProduct);
        setProducts(result.data.vendorProduct?.vegetables || []);
      }
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    }
  };

  useEffect(() => {
    getVendorProduct();
  }, []);

  return (
    <section className="bg-green-100 min-h-screen w-screen flex flex-col sm:flex-row overflow-hidden">
  {/* Sidebar */}
  <div className="sm:w-1/3 w-full px-4 border-r border-gray-300 h-full mt-4 flex flex-col">
    <h2 className="text-xl font-bold flex items-center gap-2 pb-2">
      <IoCamera size={30} /> Cart Image
    </h2>

    {/* Cart Image */}
    {vendorProduct?.cartImage && !editingImage ? (
      <div className="relative mb-4">
        <img
          src={vendorProduct.cartImage}
          alt="Cart"
          className="w-full h-48 object-cover rounded-md"
        />
        <button
          onClick={() => setEditingImage(true)}
          className="absolute top-2 right-2 !bg-green-600 text-white px-3 py-1 rounded-md hover:!bg-green-700 transition"
        >
          Edit
        </button>
      </div>
    ) : (
      <ImageUpload
        onUpload={async (url) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/owner/cart-image`,
              { cartImage: url },
              { withCredentials: true }
            );
            await getVendorProduct();
            setEditingImage(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    )}

    <div className="flex-1 overflow-y-auto mt-2">
      <VegetableMasters refreshProducts={getVendorProduct} />
    </div>
  </div>

  {/* Product List */}
  <div className="sm:w-1/3 w-full p-4 h-full overflow-y-auto border-r border-gray-300">
    <VendorProductList products={products} />
  </div>

  {/* Orders */}
  <div className="sm:w-1/3 w-full bg-orange-50 h-full overflow-y-auto p-4">
    <OwnerOrder />
  </div>
</section>

  );
};

export default OwnerDashboard;
