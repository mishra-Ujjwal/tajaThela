import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload.jsx";
import { IoCamera } from "react-icons/io5";
import VegetableMasters from "./VegetableMasters.jsx";
import VendorProductList from "./VendorProductList.jsx";
import OwnerOrder from "./OwnerOrder.jsx";
import axios from "axios";

const OwnerDashboard = () => {
  const [vendorProduct, setVendorProduct] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const getVendorProduct = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/product`,
        { withCredentials: true }
      );
      if (result.data.success) {
        setVendorProduct(result.data.vendorProduct || null);
      }
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorProduct();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-green-50">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mr-2"></span>
        <p className="text-green-700 text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <section className="bg-green-50 min-h-screen w-full px-2 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-11 gap-6">
        {/* Sidebar (Cart Image + Vegetables) */}
        <div className="md:col-span-3 bg-white p-5 rounded-xl shadow-lg h-fit flex flex-col gap-6 border border-gray-200">
          {/* Cart Image block */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-3 text-green-700">
              <IoCamera size={28} /> Cart Image
            </h2>
            {vendorProduct?.cartImage && !editingImage ? (
              <div className="relative mb-4">
                <img
                  src={vendorProduct.cartImage}
                  alt="Cart"
                  className="w-full h-44 object-cover rounded-lg border border-green-100"
                />
                <button
                  onClick={() => setEditingImage(true)}
                  className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-md shadow hover:bg-green-700 transition"
                >
                  Edit
                </button>
              </div>
            ) : (
              <ImageUpload
                onUpload={async (url) => {
                  try {
                    await axios.post(
                      `${import.meta.env.VITE_BACKEND_URL}/vendor/cart-image`,
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
          </div>
          {/* Vegetable Masters */}
          <div className="overflow-y-auto max-h-96">
            {vendorProduct && (
              <VegetableMasters refreshProducts={getVendorProduct} />
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="md:col-span-3 bg-white p-5 rounded-xl shadow-lg border border-gray-200 overflow-y-auto max-h-[600px] h-fit">
          <h2 className="text-lg font-semibold text-green-700 mb-3">Your Product List</h2>
          {vendorProduct && (
            <VendorProductList products={vendorProduct.vegetables} />
          )}
        </div>

        {/* Owner Orders */}
        <section className="md:col-span-5 bg-white p-6 rounded-lg shadow-lg border border-gray-200 overflow-y-auto max-h-[75vh]">
  <h2 className="text-lg font-bold text-green-700 mb-3">Orders</h2>
  <OwnerOrder />
</section>

      </div>
    </section>
  );
};

export default OwnerDashboard;
