/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronDown,
} from "react-icons/fa";
import logoDigident from "../../assets/home/digident-logo.webp";
import footerBg from "../../assets/Element.png";
import { Link } from "react-router-dom";

export default function Footer() {
  const [activeIcon, setActiveIcon] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=61581182323248" },
    { Icon: FaInstagram, url: "https://www.instagram.com/digident.india?igsh=MWFkdWpra293NDJ6YQ==" },
    { Icon: FaLinkedinIn, url: "https://www.linkedin.com/company/digident-india/" },
    { Icon: FaEnvelope, url: "mailto:info@digident.in" },
  ];

  return (
    <footer 
      className="relative overflow-hidden bg-[#F7E6DC]"
      
    
    >
      <div
        className="pt-26 pb-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
       <div className="site-container">
        {/* The rest of your content remains the same */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">

          {/* LOGO + SOCIAL */}
          <div className="flex flex-col items-center text-center lg:text-left">
            <img src={logoDigident} alt="Digident Logo" className="w-40 mb-4" />
            <div className="flex gap-4 mt-2 ">
              {socialLinks.map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 hover:shadow-lg transition-all"
                >
                  <Icon className="text-lg text-[#E68736]" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center lg:text-left border-b border-orange-200 lg:border-none">
            <div 
              className="flex justify-between items-center cursor-pointer lg:cursor-default py-4 lg:py-0"
              onClick={() => toggleSection('links')}
            >
              <h3 className="font-semibold text-xl lg:mb-3">Quick Links</h3>
              <FaChevronDown className={`lg:hidden transition-transform duration-300 ${openSection === 'links' ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`flex flex-col space-y-2 text-gray-700 overflow-hidden transition-all duration-300 ${openSection === 'links' ? 'max-h-60 pb-4' : 'max-h-0 lg:max-h-full'}`}>
              <Link to="/about" className="hover:text-[#E68736] cursor-pointer text-[18px]">About Us</Link>
              <Link to="/products" className="hover:text-[#E68736] cursor-pointer text-[18px]">Our Products</Link>
              <Link to="/shop" className="hover:text-[#E68736] cursor-pointer text-[18px]">Shop</Link>
              <Link to="/contact" className="hover:text-[#E68736] cursor-pointer text-[18px]">Contact Us</Link>
            </ul>
          </div>

          {/* PRODUCT CATEGORIES */}
          <div className="text-center lg:text-left border-b border-orange-200 lg:border-none">
            <div 
              className="flex justify-between items-center cursor-pointer lg:cursor-default py-4 lg:py-0"
              onClick={() => toggleSection('cats')}
            >
              <h3 className="font-semibold text-xl lg:mb-3">Product Categories</h3>
              <FaChevronDown className={`lg:hidden transition-transform duration-300 ${openSection === 'cats' ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2 text-gray-700 overflow-hidden transition-all duration-300 ${openSection === 'cats' ? 'max-h-60 pb-4' : 'max-h-0 lg:max-h-full'}`}>
              <li className="hover:text-[#E68736] cursor-pointer text-[18px]">Prosthetic Screws</li>
              <li className="hover:text-[#E68736] cursor-pointer text-[18px]">Scan Abutments</li>
              <li className="hover:text-[#E68736] cursor-pointer text-[18px]">Analogs</li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="text-center lg:text-left border-b border-orange-200 lg:border-none">
            <div 
              className="flex justify-between items-center cursor-pointer lg:cursor-default py-4 lg:py-0"
              onClick={() => toggleSection('policy')}
            >
              <h3 className="font-semibold text-xl lg:mb-3">Policies</h3>
              <FaChevronDown className={`lg:hidden transition-transform duration-300 ${openSection === 'policy' ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2 text-gray-700 overflow-hidden transition-all duration-300 ${openSection === 'policy' ? 'max-h-60 pb-4' : 'max-h-0 lg:max-h-full'}`}>
              <li><Link to="/privacy-policy" className="hover:text-[#E68736] text-[18px]">Privacy Policy</Link></li>
              <li><Link to="/Shipping-Policy" className="hover:text-[#E68736] text-[18px]">Shipping Policy</Link></li>
              <li><Link to="/TermsOfUse" className="hover:text-[#E68736] text-[18px]">Terms & Conditions</Link></li>
              <li><Link to="/Return-Policy" className="hover:text-[#E68736] text-[18px]">Exchange & Return Policy</Link></li>
            </ul>
          </div>

          {/* ADDRESS */}
                <div className="max-w-[260px] mx-auto lg:mx-0 text-center lg:text-left">
                  <h3 className="font-bold text-xl mb-3 text-[#011632]">Address</h3>
                  <ul className="space-y-4 text-[#011632]">
                    <li className="flex items-start gap-3 justify-center lg:justify-start font-semibold">
                      <FaMapMarkerAlt className="text-[#E68736] text-[20px] mt-1 flex-shrink-0" />
                      <p className="text-[15px] leading-relaxed">
                        Digident India Pvt Ltd, 314, Professor Colony, Near Matlani Garden, Behind Agrawal Sweets, Sapna Sangita Road, 
                         Indore, (M.P.)-452001.
                      </p>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <FaPhoneAlt className="text-[#E68736] text-xl flex-shrink-0" />
                      <span className="font-semibold text-[15px]">
                        +91 9294503001<br />+91 9294503002<br />+91 9294503003
                      </span>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <FaEnvelope className="text-[#E68736] text-xl flex-shrink-0" />
                      <span className="font-semibold text-[15px]">info@digident.in</span>
                    </li>
                  </ul>
                </div>
             </div>

        {/* COPYRIGHT */}
        <div className="mt-10 w-full flex justify-center relative z-10">
          <p className="text-gray-800 text-base border-b border-gray-800 pb-1 text-center">
            Copyright © {new Date().getFullYear()} Digident India | All rights reserved
          </p>
        </div>
       </div>
      </div>
    </footer>
  );
}