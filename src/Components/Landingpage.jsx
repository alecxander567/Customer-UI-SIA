import React from "react";
import {
  ShoppingCartIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "../index.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Landingpage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white text-black shadow-md relative z-20">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold">N-Tech Hardware</h1>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <a href="#services" className="hover:text-gray-600">
            Services
          </a>
          <a href="#about" className="hover:text-gray-600">
            About
          </a>
          <a href="#contact" className="hover:text-gray-600">
            Contact
          </a>
        </nav>

        {/* Right: Shop Now Button */}
        <div className="hidden md:block">
          <Link
            to="/home"
            className="w-full mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            Shop Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-black z-30">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div
        className={`md:hidden bg-white text-black shadow-md absolute w-full left-0 z-10 px-6 py-4 space-y-4 transition-all duration-300 ease-in-out overflow-hidden
                    ${
                      isOpen
                        ? "top-20 opacity-100 max-h-96"
                        : "top-16 opacity-0 max-h-0 pointer-events-none"
                    }
                `}>
        <a
          href="#services"
          onClick={() => setIsOpen(false)}
          className="block hover:text-gray-600">
          Services
        </a>
        <a
          href="#about"
          onClick={() => setIsOpen(false)}
          className="block hover:text-gray-600">
          About
        </a>
        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="block hover:text-gray-600">
          Contact
        </a>
        <Link
          to="/home"
          className="w-full mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Shop Now
        </Link>
      </div>

      <section
        className="bg-gradient-to-r from-black via-black to-gray-100 text-white px-4 sm:px-6 md:px-10 lg:px-20 pb-10 min-h-screen flex items-center justify-center"
        id="home">
        <div className="flex flex-col md:flex-row w-full items-center md:items-start justify-between gap-6">
          {/* Left: Text Content */}
          <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start mt-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Welcome to N-Tech Hardware
            </h2>
            <p className="text-base sm:text-md text-gray-300 mb-6">
              You may have noticed some of the tools used during your home
              inspection. Now you too can own some of these tools and other
              items needed as a homeowner.
            </p>

            {/* Shop Now Button */}
            <Link
              to="/home"
              className="w-full sm:w-auto mt-4 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 hover:text-black transition shadow-md text-center">
              Shop Now
            </Link>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block -mt-10">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-[300px] md:w-[400px] lg:w-[555px] h-[370px]"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="services">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <CurrencyDollarIcon className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Cash on Delivery</h3>
              <p className="text-gray-600 mt-2">
                Pay when your order arrives at your doorstep.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCardIcon className="h-16 w-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold">Online Payment</h3>
              <p className="text-gray-600 mt-2">
                Secure and fast online payment options available.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingCartIcon className="h-16 w-16 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold">Online Shopping</h3>
              <p className="text-gray-600 mt-2">
                Shop your favorite items from the comfort of home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-10 bg-white" id="products">
        <h3 className="text-5xl font-bold text-center mb-10 text-black">
          Our Products
        </h3>
        <hr></hr>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              src: "/grill.png",
              alt: "Cordless Drill",
              title: "Cordless Drill",
              desc: "High-performance drill with long battery life.",
              price: "₱2,499.00",
            },
            {
              src: "/angle.png",
              alt: "Angle Grinder",
              title: "Angle Grinder",
              desc: "Durable grinder ideal for metal and concrete work.",
              price: "₱3,199.00",
            },
            {
              src: "/hammer.png",
              alt: "Hammer Drill",
              title: "Hammer Drill",
              desc: "Powerful tool for heavy-duty construction work.",
              price: "₱4,499.00",
            },
          ].map((product, idx) => (
            <div
              key={idx}
              className="shadow-lg p-6 rounded-lg flex flex-col justify-between h-full">
              <div>
                <img
                  src={product.src}
                  alt={product.alt}
                  className="w-full h-64 mb-4 rounded"
                />
                <h4 className="text-xl font-semibold mb-2">{product.title}</h4>
                <p className="mb-2">{product.desc}</p>
                <span className="block font-bold text-lg mb-3">
                  {product.price}
                </span>
              </div>
              <Link
                to="/mockup" // the route you want to navigate to
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition inline-block text-center">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-10 bg-white" id="about">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-5xl font-bold mb-6">About Us</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              At{" "}
              <span className="font-semibold text-black-600">
                N-Tech Hardware
              </span>
              , we are passionate about providing high-quality hardware tools
              and services to meet your every need. Whether you're a DIY
              enthusiast or a professional contractor, our wide selection of
              reliable tools and expert repair support ensures you can get the
              job done right. We are committed to excellent customer service,
              timely delivery, and innovative solutions to make your projects
              easier and more efficient.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/plumber.png"
              alt="About ToolHaven"
              className="w-[350px] h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-6" id="contact">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center md:text-left space-y-2">
            <h4 className="text-xl font-semibold mb-3">Contact Us</h4>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <FaPhoneAlt /> +63 912 345 6789
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <FaPhoneAlt /> +63 987 654 3210
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <FaEnvelope /> support@toolhaven.com
            </p>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4 text-2xl">
              <a
                href="https://www.facebook.com/profile.php?id=61583605855684"
                className="hover:text-blue-500">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-sky-400">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-pink-500">
                <FaInstagram />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end text-center md:text-right">
            <p>
              &copy; {new Date().getFullYear()} N-Tech Hardware. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landingpage;
