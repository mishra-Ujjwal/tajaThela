import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-100 text-green-800 py-10 px-6 sm:mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">TajaThela</h3>
          <p className="text-sm leading-6">
            We bring fresh vegetables directly from local vendors to your doorstep. 
            Our goal is to support small farmers while providing you with 
            healthy and organic produce every day.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Shop</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Contact Us</h3>
          <p className="text-sm">📍 123 Green Street, City, India</p>
          <p className="text-sm">📞 +91 7701883014</p>
          <p className="text-sm">✉️ support@tajathela.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="https://www.instagram.com/its_ujjwalmishra/" className="hover:text-white"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/ujjwalmishra7/" className="hover:text-white"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} VeggieShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
