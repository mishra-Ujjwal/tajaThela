import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { calculateDistance } from "../utils/calculateDistance.js";

const UserDashboard = () => {
  const vendor = useSelector((state) => state.vendor.vendorData);
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const vendorSectionRef = useRef(null);

  const handleClickButton = (id) => {
    navigate(`/vendor-profile/${id}`);
  };

  const scrollToVendors = () => {
    const offset = 80;
    const top =
      vendorSectionRef.current.getBoundingClientRect().top +
      window.scrollY -
      offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const loading = !vendor || vendor.length === 0; // if vendor data not yet loaded

  return (
    <section>
      {/* HERO SECTION */}
      <div className="lg:px-24 flex sm:flex-row flex-col-reverse w-screen pb-10 lg:pt-20 bg-orange-50">
        <div className="sm:w-2/4 w-full px-10">
          <h3 className="text-3xl sm:pt-0 pt-3 lg:text-5xl font-bold leading-tight text-green-900">
            Fresh Vegetables from <br />
            <span className="text-green-600">Local Vendors</span> to Your
            Doorstep
          </h3>
          <p className="sm:text-xl text-base text-green-900 sm:pt-8 pt-2 sm:w-[80%] w-full">
            Fresh veggies from local thelas, delivered straight to your
            doorstep. Support farmers, eat fresh!
          </p>

          <div className="flex items-center sm:pt-8 pt-4 gap-10 w-full justify-center sm:justify-normal">
            <div
              className="sm:px-8 sm:py-3 px-4 py-3 cursor-pointer hover:bg-green-800 transition duration-300 bg-green-700 text-white font-bold rounded-full"
              onClick={scrollToVendors}
            >
              <h2>Order Now</h2>
            </div>
            <div className="sm:px-8 sm:py-3 px-4 py-3 cursor-pointer text-green-800 hover:bg-green-600 hover:text-white transition duration-300 shadow-lg border-1 border-gray-300 font-bold rounded-full">
              <h2>Learn More</h2>
            </div>
          </div>
        </div>
        <div className="sm:w-2/4 w-full pt-4 sm:pt-0">
          <img src="/heroImage.png" alt="" />
        </div>
      </div>

      {/* VENDORS SECTION */}
      <div ref={vendorSectionRef} className="lg:px-24 px-2 bg-white py-4 w-screen">
        <div className="text-4xl text-green-900 text-center font-bold">
          Vendors Near You
        </div>
        <p className="text-center text-lg py-1 px-4">
          Fresh produce from trusted local vendors in your area
        </p>

        {/* ✅ Loading Skeleton */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pt-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[150px] p-2 bg-white shadow rounded-lg flex-shrink-0 animate-pulse"
              >
                <div className="w-60 h-40 bg-gray-200 rounded-lg"></div>
                <div className="h-5 bg-gray-200 mt-3 w-3/4 mx-auto rounded"></div>
                <div className="h-4 bg-gray-200 mt-2 w-1/2 mx-auto rounded"></div>
                <div className="flex justify-center mt-3 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ✅ Loaded vendor cards */
          <div className="overflow-x-auto w-full pt-2">
            <div className="flex gap-4">
              {vendor?.map((each, idx) => {
                if (!each.vendorId?.location?.coordinates) return null;

                const [vendorLng, vendorLat] = each.vendorId.location.coordinates;
                const userLat = user?.location?.coordinates?.[1];
                const userLng = user?.location?.coordinates?.[0];

                const distance =
                  userLat && userLng
                    ? calculateDistance(userLat, userLng, vendorLat, vendorLng)
                    : "N/A";

                return (
                  <div
                    key={idx}
                    className="min-w-[150px] p-2 bg-white shadow rounded-lg flex-shrink-0 cursor-pointer hover:shadow-lg transition"
                    onClick={() => handleClickButton(each.vendorId._id)}
                  >
                    <img
                      src={each.cartImage}
                      alt=""
                      className="w-60 h-40 object-cover object-center rounded-lg"
                    />
                    <p className="text-xl text-center py-2">
                      {each.vendorId.name} Sabjiwala
                    </p>
                    <p className="text-center">
                      {distance} {distance !== "N/A" && "km away"}
                    </p>
                    <div className="flex w-full items-center justify-center py-1 text-yellow-500">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} className="w-5 h-5" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDashboard;
