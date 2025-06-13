"use client";
import React from "react";

const AyurvedaHero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-yellow-400 overflow-hidden">
      {/* Background Image with Black Frame */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero_image.jpg"
          alt="Ayurveda background"
          className="w-full h-full object-cover opacity-90 shadow-[0_0_0_10px_rgba(0,0,0,0.8)]"
        />
        {/* Optional Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Floating Leaves */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>

      <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-yellow-300 rounded-full opacity-70 animate-bounce delay-300"></div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto sm:mx-16 px-6 py-20 flex items-center min-h-screen">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
          {/* Text Content */}
          <div className="flex-1 text-white space-y-8">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-mono leading-tight"
              style={{ fontFamily: "Asar, serif" }}
            >
              Ayurveda strengthens
              <br />
              the value of Your
              <br />
              <span className="text-white">Daily Life</span>
            </h1>

            <button
              className="group bg-green-600 mt-3 hover:bg-green-700 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-green-300"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Shop our best products
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 text-white">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.1"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default AyurvedaHero;
