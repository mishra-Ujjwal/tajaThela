import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

export default function SignUpPage() {
  const [role, setRole] = useState("user"); // default role
  const [agreed, setAgreed] = useState(false);
  const roles = ["user", "deliveryBoy", "owner"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleGoogleAuth = async () => {
  //   const provider = new GoogleAuthProvider();
  //   const result = await signInWithPopup(auth, provider);
  //   console.log(result);
  //   try {
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleSignUp = async (e) => {
    e.preventDefault(); // prevent page reload
    console.log("inside this");
    if (!role) {
      toast.error("Please select a role!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        { name, email, password, mobile, role },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Signup successful!");
        dispatch(setUserData(res.data.user))
        console.log("User added");
        // Optional: reset form
        setName("");
        setEmail("");
        setPassword("");
        setMobile("");
        setRole("user");
        setAgreed(false);
        navigate("/");
      } else {
        console.log(res.data.message);
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Signup failed!");
      console.log(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img src="/heroImage.png" alt="" className="h-20" />
          <h2 className="text-xl font-bold mb-6 text-center">Sign Up</h2>
        </div>

        <form className="space-y-2" onSubmit={handleSignUp}>
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border outline-none rounded-lg px-3 py-2   transition duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300 transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium">Mobile</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300 transition duration-300"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          {/* Role Buttons */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <div className="flex gap-2">
              {roles.map((r) => (
                <div
                  key={r}
                  className={`flex-1 flex items-center justify-center text-lg border rounded-lg py-2 px-1 cursor-pointer transition duration-300 ${
                    role === r
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-green-900 hover:bg-green-200"
                  }`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">I agree to the terms and conditions</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full !bg-orange-600 hover:!bg-orange-700 text-white rounded-lg py-2 font-semibold transition duration-300"
          >
            Signup
          </button>
          {/* <div className="mt-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 transition duration-200"
              onClick={handleGoogleAuth}
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium text-gray-700">
                Sign up with Google
              </span>
            </button>
          </div> */}
          {/* Signup link */}
          <p className="mt-2 text-center text-sm">
            Have an account?{" "}
            <Link
              to="/login"
              className="!text-green-800 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
