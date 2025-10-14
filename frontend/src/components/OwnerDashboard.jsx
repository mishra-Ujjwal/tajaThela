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

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <section className="bg-green-100 min-h-screen w-full p-2">
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 max-w-7xl mx-auto">
        {/* Sidebar - 2/7 */}
        <div className="md:col-span-2 flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-sm h-full">
          <h2 className="text-xl font-bold flex items-center gap-2 pb-2">
            <IoCamera size={30} /> Cart Image
          </h2>

          {vendorProduct?.cartImage && !editingImage ? (
            <div className="relative mb-4">
              <img
                src={vendorProduct.cartImage}
                alt="Cart"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                onClick={() => setEditingImage(true)}
                className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
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

          <div className="flex-1 overflow-y-auto mt-2">
            {vendorProduct && (
              <VegetableMasters refreshProducts={getVendorProduct} />
            )}
          </div>
        </div>

        {/* Product List - 2/7 */}
        <div className="md:col-span-2 flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-sm overflow-y-auto h-full">
          {vendorProduct && (
            <VendorProductList products={vendorProduct.vegetables} />
          )}
        </div>

        {/* Orders - 3/7 */}
        <div className="md:col-span-3 flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-sm overflow-y-auto h-full">
          <OwnerOrder />
        </div>
      </div>
    </section>
  );
};

export default OwnerDashboard;
