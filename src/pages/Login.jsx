import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Login() {
  return (
    <div>
      <Navbar />

      {/* Centered container instead of full-screen stretch */}
      <div className="bg-gray-100 py-20 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

          {/* Left Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
            <img
              src="src/assets/voting pic.png" // Replace with your actual image path
              alt="Voting Illustration"
              className="max-w-[350px] w-full h-auto"
            />
          </div>

          {/* Right Login Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md bg-[#F6F4F4] rounded-xl shadow-2xl p-10">

              {/* Header */}
              <h2 className="text-3xl font-semibold mb-6">
                Welcome <span className="text-blue-600 font-bold">Back</span>
              </h2>

              {/* Wallet Connect */}
              <div className="bg-white rounded-md p-3 flex items-center gap-3 mb-6">
                <img
                  src="https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png"
                  alt="MetaMask"
                  className="w-6 h-6"
                />
                <span className="font-semibold text-sm">Connect Wallet</span>
              </div>

              {/* Inputs */}
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  Remember for 30 days
                </label>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Forgot password
                </a>
              </div>

              {/* Login Button */}
              <button className="w-full bg-[#2F64FF] text-white font-medium py-3 rounded-md hover:bg-blue-700 mb-4 transition duration-200 shadow">
                Login
              </button>

              {/* Google Login */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#E8E2E2] rounded-md hover:bg-[#E5D9D9] transition duration-200">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login
