// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-5 mb-10">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold"></h3>
            <p className="mt-2 text-gray-400"></p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">policies</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/return-refund-policy" className="text-gray-400 hover:text-white">Return & Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/contact-information-policy" className="text-gray-400 hover:text-white">Contact Information Policy</Link></li>

            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">For Marchent</h3>
            <ul className="mt-4 space-y-2">
              <li><Link  className="text-gray-400 hover:text-white">List Your Business</Link></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-white">Partner</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className='flex flex-col'> 
              <a href="https://www.instagram.com/kocart_/" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
          <h1 className="mt-8 text-white text-lg text-center">
            Kocart is a digital platform that connects customers with nearby local merchants 
            (restaurants, grocery marts, and clothing stores) within a 3 km radius. 
            Customers can easily discover, order, and receive products quickly, 
            while merchants gain more online visibility, orders, and sales through the platform.
            <br />
            Kocart charges a delivery fee based on distance,
             a ₹11 platform fee per order, 
             and 3% online payment gateway charges for digital payments. 
             This simple pricing model helps keep costs transparent for customers while supporting platform operations and payment processing.
          </h1>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Evently. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;