import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import axios from 'axios';
import { clearUserData } from '../../redux/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
const UserMenu = ({ onClose }) => {
  const user = useSelector((state) => state.user.userData)
  const menuRef = useRef(null)
  const navigate = useNavigate()
 const dispatch = useDispatch()
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose() // call parent function to close menu
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleLogOut = async()=>{
    try{
     const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`,{},{withCredentials:true})
     if(res.data.success){
        onClose()
        dispatch(clearUserData())
        console.log("succesfully logout")
        navigate("/")
     }
     else{
        console.log("error in result")
     }
    }catch(err){
        console.log(err)
    }
  }

  return (
    <div
      ref={menuRef}
      className=" absolute w-45 px-3 py-3 right-0 top-15 rounded-xl  bg-green-50 text-green-800 space-y-1.5 "
    >
      <div className='cursor-pointer text-lg gap-2 font-medium flex items-center '><p className=' px-2 text-white rounded-full bg-orange-600 w-fit flex items-center justify-center'> {user?.name.slice(0,1).toUpperCase()}</p> {user?.name}</div>
      <div className='text-lg font-semibold flex items-center gap-2 cursor-pointer' onClick={()=>{navigate("/user-orders")}}>Your Orders</div>
      <div className='text-lg font-semibold flex items-center gap-2 cursor-pointer' onClick={handleLogOut}> <TbLogout2 />Logout</div>
    </div>
  )
}

export default UserMenu
