import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import useGetCurrentUser from '../Hooks/useGetCurrentUser.jsx'
import useGetLocation from '../Hooks/useGetLocation.jsx'
import { ToastContainer } from 'react-toastify'
import useGetAllVendor from '../Hooks/useGetAllVendor.jsx'
import { useGetCart } from '../Hooks/useGetCart.jsx'
import useGetOrder from '../Hooks/useGetOrder.jsx'
import useUpdateLocation from '../Hooks/useUpdateLocation.jsx'


const App = () => {
  useGetCurrentUser()
  useGetLocation()
  useGetAllVendor()
   useGetCart()
   useGetOrder()
   useUpdateLocation()

  return (
     <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default App