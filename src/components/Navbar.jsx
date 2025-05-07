import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-black">LedgerVote</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-semibold">
          <li><a href="#" className="text-blue-600">Home</a></li>
          <li><a href="#" className="text-black hover:text-blue-600">Login</a></li>
          <li><a href="#" className="text-black hover:text-blue-600">Register</a></li>
          <li><a href="#" className="text-black hover:text-blue-600">FAQ</a></li>
          <li><a href="#" className="text-black hover:text-blue-600">Contact Us</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            // Close Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-2 font-semibold">
          <li><a href="#" className="block text-blue-600">Home</a></li>
          <li><a href="#" className="block text-black hover:text-blue-600">Login</a></li>
          <li><a href="#" className="block text-black hover:text-blue-600">Register</a></li>
          <li><a href="#" className="block text-black hover:text-blue-600">FAQ</a></li>
          <li><a href="#" className="block text-black hover:text-blue-600">Contact Us</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
