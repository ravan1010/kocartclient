
// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-5 mb-10">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold">GoodsAuto</h3>

            <p className="mt-3 text-gray-400 text-sm leading-6">
              Book 3-wheeler and 4-wheeler goods vehicles for
              local parcel and goods transportation.
            </p>

            <p className="mt-3 text-gray-400 text-sm">
              Connecting customers with nearby transport partners.
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-lg font-semibold">
              For Customers
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white"
                >
                  Book a Vehicle
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-white"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="text-lg font-semibold">
              For Partners
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/partner"
                  className="text-gray-400 hover:text-white"
                >
                  Become a Driver Partner
                </Link>
              </li>

              <li>
                <Link
                  to="/partner/login"
                  className="text-gray-400 hover:text-white"
                >
                  Partner Login
                </Link>
              </li>

              <li>
                <Link
                  to="/partner/earnings"
                  className="text-gray-400 hover:text-white"
                >
                  Partner Earnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-semibold">
              Legal & More
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-400 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/return-refund-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/contact-information-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Information
                </Link>
              </li>
            </ul>

            <div className="mt-4">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 border-t border-gray-700 pt-6">
          <p className="text-center text-gray-400 text-sm leading-6">
            GoodsAuto is a digital platform that helps customers
            find and book nearby goods transportation vehicles,
            including 3-wheelers and 4-wheelers, for local
            transportation and parcel delivery.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} GoodsAuto. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;

