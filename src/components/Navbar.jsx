import React from 'react'

function Navbar() {
  return (

    
    <nav className="bg-white shadow">
    <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center py-4">
      <div className="text-xl font-bold text-black">LedgerVote</div>
      <ul className="flex space-x-6 font-semibold">
        <li><a href="#" className="text-blue-600">Home</a></li>
        <li><a href="#" className="text-black hover:text-blue-600">Login</a></li>
        <li><a href="#" className="text-black hover:text-blue-600">Register</a></li>
        <li><a href="#" className="text-black hover:text-blue-600">FAQ</a></li>
        <li><a href="#" className="text-black hover:text-blue-600">Contact Us</a></li>
      </ul>

    </div>
    
  </nav>
  
  )
}

export default Navbar
