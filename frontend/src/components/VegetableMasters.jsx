import axios from "axios";
import React, { useEffect, useState } from "react";

const VegetableMasters = ({ refreshProducts }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedVeg, setSelectedVeg] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    quantity: "",
    unit: "kg",
  });

  const backend = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch vegetable list
  const allVegetableList = async () => {
    console.log("📡 Fetching vegetables from:", `${backend}/vendor/allVegetableList`);
    try {
      setLoading(true);
      const res = await axios.get(`${backend}/vendor/allVegetableList`, {
        withCredentials: true,
      });
      console.log("✅ Response:", res.data);
      if (res.data.success) {
        setList(res.data.vegetables);
      } else {
        console.warn("⚠️ Unexpected response:", res.data);
      }
    } catch (err) {
      console.error("🚨 Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allVegetableList();
  }, []);

  const openPopupForm = (item) => {
    setOpen(true);
    setSelectedVeg(item);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedVeg) return;
    try {
      const res = await axios.post(
        `${backend}/vendor/addVegetable`,
        {
          vegetableId: selectedVeg._id,
          price: formData.price,
          quantity: formData.quantity,
          unit: formData.unit,
        },
        { withCredentials: true }
      );
      console.log("🟢 Add Vegetable:", res.data);
      if (res.data.success) {
        refreshProducts?.();
        setOpen(false);
        setFormData({ price: "", quantity: "", unit: "kg" });
      }
    } catch (err) {
      console.error("❌ Add error:", err.message);
    }
  };

  return (
    <section className="pt-2 relative">
      <h2 className="text-xl font-semibold text-green-900 mb-4">
        Add Vegetables In Your Cart
      </h2>

      {/* ✅ Skeleton / List */}
      <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-6 pt-2 pb-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-32 h-32 flex flex-col gap-2 items-center justify-center border rounded-lg bg-gray-100 animate-pulse shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-300 rounded-md" />
              <div className="w-16 h-3 bg-gray-300 rounded" />
            </div>
          ))
        ) : list.length > 0 ? (
          list.map((item) => (
            <div
              key={item._id}
              className="w-32 h-32 flex flex-col gap-1 items-center justify-center relative border rounded-lg bg-white shadow-sm hover:scale-105 transition-all"
            >
              <img
                src={`${backend}${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md p-1"
              />
              <p className="font-medium text-base text-center">{item.name}</p>
              <button
                onClick={() => openPopupForm(item)}
                className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">No vegetables found.</p>
        )}
      </div>

      {/* ✅ Popup */}
      {open && selectedVeg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-4">
              <img
                src={`${backend}${selectedVeg.image}`}
                alt={selectedVeg.name}
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{selectedVeg.name}</h2>
            </div>

            <form onSubmit={submitHandler} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Price"
                className="border px-3 py-2 rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                className="border px-3 py-2 rounded"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
              <select
                className="border px-3 py-2 rounded"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                required
              >
                <option value="kg">kg</option>
                <option value="pieces">pieces</option>
                <option value="bundle">bundle</option>
                <option value="gm">gm</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border px-4 py-2 rounded text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default VegetableMasters;
