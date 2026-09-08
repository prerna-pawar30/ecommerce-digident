/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import logoDigident from "../../assets/home/digident-logo.webp";
import footerBg from "../../assets/Element.png";
import { Link } from "react-router-dom";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function Footer() {
  const [activeIcon, setActiveIcon] = useState(null);

  // 1. Array with your specific links and icons
  const socialLinks = [
    {
      Icon: FaFacebookF,
      url: "https://www.facebook.com/profile.php?id=61581182323248",
    },
    {
      Icon: FaInstagram,
      url: "https://www.instagram.com/digident.india?igsh=MWFkdWpra293NDJ6YQ==",
    },
    {
      Icon: FaLinkedinIn,
      url: "https://www.linkedin.com/company/digident-india/",
    },
    {
      Icon: FaEnvelope,
      url: "mailto:info@digident.in",
    },
  ];

  return (
    <footer className="relative bg-[#F7E6DC] overflow-hidden ">
      <div
        className="mx-auto max-w-[1600px] pt-10 sm:pt-12 lg:pt-16 bg-cover  bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 relative z-10">

          {/* LOGO + SOCIAL */}
          <div className="flex flex-col items-center  text-center lg:text-left">
            <img src={logoDigident} alt="Digident Logo" className="w-40 mb-4" />

            {/* Social Icons Center on Mobile */}
            <div className="flex gap-4 mt-2 ">
              {socialLinks.map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveIcon(index)}
                  className="p-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 hover:shadow-lg transition-all"
                >
                  <Icon
                    className={`text-lg transition-all duration-300 ${
                      activeIcon === index
                        ? "text-[#E68736]"
                        : "text-[#E68736]"
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center lg:text-left">
            <h3 className="font-semibold text-xl mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/about`}>About Us</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product`}>Our Products</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href="https://shop.digident.in" target="_blank" rel="noopener noreferrer">Shop</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/contact`}>Contact Us</a></li>
            </ul>
          </div>

          {/* PRODUCT CATEGORIES */}
          <div className="text-center lg:text-left">
            <h3 className="font-semibold text-xl mb-3">Product Categories</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product/screw`}>Screws</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product/abutment`}>Abutments</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product/lab-analog`}>Lab Analogs</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product/scanbody`}>ScanBody</a></li>
              <li className="hover:text-[#E6762E] cursor-pointer text-[18px]"><a href={`${FRONTEND_URL}/product/scanbridge`}>Scan Bridges</a></li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="text-center lg:text-left">
            <h3 className="font-semibold text-xl mb-3">Policies</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link to="/privacy-policy" state={{ activeTab: "privacy" }} className="hover:text-[#E6762E] cursor-pointer text-[18px]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/Shipping-Policy" state={{ activeTab: "shipping" }} className="hover:text-[#E6762E] cursor-pointer text-[18px]">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/TermsOfUse" state={{ activeTab: "terms" }} className="hover:text-[#E6762E] cursor-pointer text-[18px]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/Return-Policy" state={{ activeTab: "return" }} className="hover:text-[#E6762E] cursor-pointer text-[18px]">
                  Exchange & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* ADDRESS */}
          <div className="max-w-[260px] mx-auto lg:mx-0 text-center lg:text-left">
            <h3 className="font-semibold text-xl mb-3">Address</h3>

            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3 justify-center lg:justify-start">
                <FaMapMarkerAlt className="text-[#E6762E] text-[40px] sm:text-[60px] mt-1" />
                <p className="text-[15px] leading-relaxed">
                  Digident India Pvt Ltd, 314, Professor Colony, Near Matlani Garden, Behind Agrawal Sweets, Sapna Sangita Road,
                  Indore, (M.P.)-452001.
                </p>
              </li>

              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <FaPhoneAlt className="text-[#E6762E] text-xl" />
                <span className="font-semibold">+91 9294503001 <br/> +91 9294503002 <br /> +91 9294503003</span>
              </li>


              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <FaEnvelope className="text-[#E6762E] text-xl" />
                <span className="font-semibold">info@digident.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 w-full flex justify-center relative z-10">
          <p className="text-gray-600 text-base border-b border-gray-600 pb-1">
            Copyright © {new Date().getFullYear()} Digident India | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
