import React from "react";

const VendorProductList = ({ products }) => {
  console.log(products);
 
  if (!products || products.length === 0) {
    return <p className="text-gray-500 mt-2">No products added yet</p>;
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mt-2">Your Products</h2>

      <div className="mt-2 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {products.map((v) => (
            <div
              key={v.vegetableId._id}
              className="border p-2 rounded shadow-sm bg-white"
            >
              <img
                src={v.vegetableId.image}
                className="w-full h-24 object-cover rounded"
                alt={v.vegetableId.name}
              />
              <p className="font-bold mt-1">{v.vegetableId.name}</p>
              <p className="text-sm text-gray-600">Stock: {v.quantity}</p>
              <p className="text-green-700 font-semibold">
                ₹{v.price} / {v.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProductList;
