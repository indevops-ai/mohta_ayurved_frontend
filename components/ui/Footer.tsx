import React from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#009846] text-white">
      {/* Main Footer Content */}
      <div className="px-6 py-12">
        <div className="max-w-8xl max-w-8xl mx-auto px-4 sm:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-6">
                Shri Mohta Rasayanshala
              </h2>

              <div className="space-y-2 text-sm">
                <p>C-8,9, Industrial Estate HATHRAS-204101,</p>
                <p>Uttar Pradesh (INDIA)</p>
              </div>

              {/* QR Code */}
              <div className="flex items-center space-x-3 my-4">
                <div className="w-16 h-16 bg-white p-1 rounded">
                  <div className="w-full h-full bg-black opacity-80 rounded flex items-center justify-center">
                    <span className="text-white text-xs">QR</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="underline text-sm hover:text-green-200 cursor-pointer">
                    Bulk price list
                  </div>
                  <div className="underline text-sm hover:text-green-200 cursor-pointer">
                    Retail price list
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <p className="underline hover:text-green-200 cursor-pointer">
                  info@mohtaayurved.com
                </p>
                <p className="underline hover:text-green-200 cursor-pointer">
                  shrimohta@yahoo.com
                </p>
                <p>+91-5722276769</p>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-4 pt-4">
                <Facebook className="w-6 h-6 hover:text-green-200 cursor-pointer" />
                <Instagram className="w-6 h-6 hover:text-green-200 cursor-pointer" />
                <MessageCircle className="w-6 h-6 hover:text-green-200 cursor-pointer" />
              </div>
            </div>

            {/* Menu Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Menu</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Proprietary products Vati
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Classical products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Testimonial
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Tail
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Asav-Arishta
                  </a>
                </li>
              </ul>
            </div>

            {/* Medicine Category Section 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Medicine category</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Kwath
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Churna
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Pak Avleh
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Parpati
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Loh & Mandoor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Swata/Mukta
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Guggulu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Shilajit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Bashma Pishti
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Ras Rasayan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Sodhit Dravya
                  </a>
                </li>
              </ul>
            </div>

            {/* Medicine Category Section 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-6 opacity-0">
                Medicine category
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Kupipakwa Rasan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Kshar Satva Lawan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-200 transition-colors"
                  >
                    Precious Bhasam
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-[#00311766] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm">
            © 2025 Shri Mohta Rasayanshala. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
