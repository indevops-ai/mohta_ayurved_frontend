"use client";

import React, { useState, useEffect, useRef } from "react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 left-0 w-full bg-white shadow-lg z-50"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-20  flex justify-between items-center h-[70px]">
        {/* Logo Section */}
        <a href="#" className="flex items-center no-underline ">
          <div className="w-10 h-10 mx-2">
            <img
              src="/mohtalogo2.png"
              alt="Logo"
              className="w-full h-full object-contain rounded-lg flex items-center justify-center mr-3 md:w-9 md:h-9 md:mr-2.5 overflow-hidden"
            />
          </div>
          <div>
            <div className="text-gray-800 text-lg font-semibold md:text-base">
              Shri Mohta
            </div>
            <div className="text-gray-600 text-sm font-normal">
              Rasayanshala
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex list-none gap-10 items-center">
          <li className="relative">
            <a
              href="#home"
              className="no-underline text-gray-600 text-base font-medium py-2 relative transition-colors duration-300 hover:text-pink-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
          </li>
          <li className="relative">
            <a
              href="#about"
              className="no-underline text-gray-600 text-base font-medium py-2 relative transition-colors duration-300 hover:text-pink-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              About us
            </a>
          </li>
          <li className="relative">
            <a
              href="#proprietary"
              className="no-underline text-gray-600 text-base font-medium py-2 relative transition-colors duration-300 hover:text-pink-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Proprietary products
            </a>
          </li>
          <li className="relative">
            <a
              href="#classical"
              className="no-underline text-gray-600 text-base font-medium py-2 relative transition-colors duration-300 hover:text-pink-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Classical products
            </a>
          </li>
          <li className="relative">
            <a
              href="#contact"
              className="no-underline text-gray-600 text-base font-medium py-2 relative transition-colors duration-300 hover:text-pink-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact us
            </a>
          </li>
        </ul>

        {/* User Icon */}
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:border-pink-600">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[18px] h-[18px] text-gray-600"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer p-2"
          onClick={toggleMobileMenu}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200`}
      >
        <ul className="list-none p-5">
          <li className="mb-4">
            <a
              href="#home"
              onClick={closeMobileMenu}
              className="no-underline text-gray-600 text-base font-medium block py-2.5 border-b border-gray-100 transition-colors duration-300 hover:text-pink-600"
            >
              Home
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#about"
              onClick={closeMobileMenu}
              className="no-underline text-gray-600 text-base font-medium block py-2.5 border-b border-gray-100 transition-colors duration-300 hover:text-pink-600"
            >
              About us
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#proprietary"
              onClick={closeMobileMenu}
              className="no-underline text-gray-600 text-base font-medium block py-2.5 border-b border-gray-100 transition-colors duration-300 hover:text-pink-600"
            >
              Proprietary products
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#classical"
              onClick={closeMobileMenu}
              className="no-underline text-gray-600 text-base font-medium block py-2.5 border-b border-gray-100 transition-colors duration-300 hover:text-pink-600"
            >
              Classical products
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#contact"
              onClick={closeMobileMenu}
              className="no-underline text-gray-600 text-base font-medium block py-2.5 border-b border-gray-100 transition-colors duration-300 hover:text-pink-600"
            >
              Contact us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
