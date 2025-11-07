import axios from "axios";
import React, { useEffect, useState } from "react";

const VegetableMasters = ({refreshProducts}) => {


  const [list, setList] = useState([]);
  const [open,setOpen]=useState(false)
  const [selectedVeg,setSelectedVeg] = useState(null)
    const [formData, setFormData] = useState({ price: "", quantity: "", unit: "kg" });
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
        const payload = {
        vegetableId: selectedVeg._id,
        price: formData.price,
        quantity: formData.quantity,
        unit: formData.unit,
      };
      console.log(payload)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/addVegetable`,
        payload,
        { withCredentials: true } // ✅ send cookies
      );
      if (res.data.success) {
        console.log("✅ Product is added", res.data);
        refreshProducts()
        setOpen(false)
      } else {
        console.log("⚠️ Something error:", res.data.message);
      }
    } catch (err) {
      console.log("🚨 Axios error:", err.response?.data || err.message);
    }
  };
  const openPopupForm = (item)=>{
     setOpen(true)
     setSelectedVeg(item)
  }

  const allVegetableList = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/allVegetableList`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setList(res.data.vegetables);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    allVegetableList();
  }, []);
  return (
    <section className=" pt-2 relative">
      <h2 className="text-xl font-semibold text-green-900 ">
        Add Vegtables In Your cart
      </h2>
      <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-6 pt-2 pb-5">
        {list.map((item) => (
        <div
    key={item._id}
    className="shrink-0 w-32 h-32 flex flex-col gap-1 items-center justify-center relative border rounded-lg bg-white shadow-sm"
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-24 h-24 object-cover rounded-md p-1"
    />
    <p className="font-medium text-base text-center">{item.name}</p>

    {/* Add button */}
    <div
      onClick={() => openPopupForm(item)}
      className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white font-semibold text-xs rounded-lg hover:bg-orange-600"
    >
      Add
    </div>

    {/* Inline Popup Form */}
    {open && selectedVeg && (
  <div className="fixed inset-0 bg-orange-200 bg-opacity-50 z-50  flex items-center justify-center">
    {/* White Form Container */}
    <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
        onClick={() => setOpen(false)}
      >
        ✕
      </button>

      {/* Vegetable Image & Name */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={selectedVeg.image}
          alt={selectedVeg.name}
          className="w-32 h-32 object-cover rounded mb-2"
        />
        <h2 className="text-xl font-semibold">{selectedVeg.name}</h2>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-3"
        onSubmit={
          submitHandler
        }
      >
        <input
          type="number"
          placeholder="Price"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
        />

        <select
  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
  value={formData.unit} // ✅ controlled value
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

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="border px-4 py-2 rounded !text-gray-600 hover:!text-gray-800"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="!bg-green-500 text-white px-4 py-2 rounded hover:!bg-green-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  </div>
))}

      </div>
      

    </section>
  );
};

export default VegetableMasters;
